'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { 
  MapContextType, 
  MapState, 
  CorruptionLocation, 
  Coordinates, 
  PHILIPPINES_CENTER, 
  DEFAULT_MAP_ZOOM 
} from '../types/map';

// Define action types for the reducer
type MapAction =
  | { type: 'SET_CENTER'; payload: Coordinates }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_SELECTED_LOCATION'; payload: CorruptionLocation | null }
  | { type: 'ADD_CORRUPTION_LOCATION'; payload: CorruptionLocation }
  | { type: 'UPDATE_CORRUPTION_LOCATION'; payload: { id: string; updates: Partial<CorruptionLocation> } }
  | { type: 'SET_CORRUPTION_LOCATIONS'; payload: CorruptionLocation[] }
  | { type: 'CLEAR_LOCATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_MAP' };

// Define the state structure
interface MapContextState {
  mapState: MapState;
  corruptionLocations: CorruptionLocation[];
  selectedLocation: CorruptionLocation | null;
}

// Initial state
const initialState: MapContextState = {
  mapState: {
    center: PHILIPPINES_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    isLoading: false,
    error: undefined,
  },
  corruptionLocations: [],
  selectedLocation: null,
};

// Reducer function
function mapReducer(state: MapContextState, action: MapAction): MapContextState {
  switch (action.type) {
    case 'SET_CENTER':
      return {
        ...state,
        mapState: {
          ...state.mapState,
          center: action.payload,
        },
      };

    case 'SET_ZOOM':
      return {
        ...state,
        mapState: {
          ...state.mapState,
          zoom: action.payload,
        },
      };

    case 'SET_SELECTED_LOCATION':
      return {
        ...state,
        selectedLocation: action.payload,
      };

    case 'ADD_CORRUPTION_LOCATION':
      // Check if location already exists
      const existingIndex = state.corruptionLocations.findIndex(
        loc => loc.id === action.payload.id
      );
      
      if (existingIndex >= 0) {
        // Update existing location by merging articles
        const existingLocation = state.corruptionLocations[existingIndex];
        const mergedArticles = [
          ...existingLocation.articles,
          ...action.payload.articles.filter(
            newArticle => !existingLocation.articles.some(
              existing => existing.id === newArticle.id
            )
          )
        ];

        const updatedLocation: CorruptionLocation = {
          ...existingLocation,
          articles: mergedArticles,
          corruptionType: [
            ...new Set([...existingLocation.corruptionType, ...action.payload.corruptionType])
          ],
          lastUpdated: action.payload.lastUpdated,
          // Update severity to the highest level
          severity: getSeverityLevel(existingLocation.severity, action.payload.severity),
        };

        const updatedLocations = [...state.corruptionLocations];
        updatedLocations[existingIndex] = updatedLocation;

        return {
          ...state,
          corruptionLocations: updatedLocations,
        };
      } else {
        // Add new location
        return {
          ...state,
          corruptionLocations: [...state.corruptionLocations, action.payload],
        };
      }

    case 'UPDATE_CORRUPTION_LOCATION':
      return {
        ...state,
        corruptionLocations: state.corruptionLocations.map(location =>
          location.id === action.payload.id
            ? { ...location, ...action.payload.updates }
            : location
        ),
      };

    case 'SET_CORRUPTION_LOCATIONS':
      return {
        ...state,
        corruptionLocations: action.payload,
      };

    case 'CLEAR_LOCATIONS':
      return {
        ...state,
        corruptionLocations: [],
        selectedLocation: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        mapState: {
          ...state.mapState,
          isLoading: action.payload,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        mapState: {
          ...state.mapState,
          error: action.payload || undefined,
        },
      };

    case 'RESET_MAP':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// Helper function to determine higher severity level
function getSeverityLevel(
  current: 'low' | 'medium' | 'high' | 'critical', 
  incoming: 'low' | 'medium' | 'high' | 'critical'
): 'low' | 'medium' | 'high' | 'critical' {
  const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
  const currentLevel = severityOrder[current];
  const incomingLevel = severityOrder[incoming];
  
  if (incomingLevel > currentLevel) {
    return incoming;
  }
  return current;
}

// Create the context
const MapContext = createContext<MapContextType | undefined>(undefined);

// Provider component
interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Action creators
  const setMapCenter = useCallback((coordinates: Coordinates) => {
    dispatch({ type: 'SET_CENTER', payload: coordinates });
  }, []);

  const setMapZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const selectLocation = useCallback((location: CorruptionLocation | null) => {
    dispatch({ type: 'SET_SELECTED_LOCATION', payload: location });
    
    // If selecting a location, also center the map on it
    if (location) {
      dispatch({ type: 'SET_CENTER', payload: location.coordinates });
      dispatch({ type: 'SET_ZOOM', payload: 13 }); // Zoom in when selecting a specific location
    }
  }, []);

  const addCorruptionLocation = useCallback((location: CorruptionLocation) => {
    dispatch({ type: 'ADD_CORRUPTION_LOCATION', payload: location });
  }, []);

  const updateCorruptionLocation = useCallback((
    id: string, 
    updates: Partial<CorruptionLocation>
  ) => {
    dispatch({ type: 'UPDATE_CORRUPTION_LOCATION', payload: { id, updates } });
  }, []);

  const setCorruptionLocations = useCallback((locations: CorruptionLocation[]) => {
    dispatch({ type: 'SET_CORRUPTION_LOCATIONS', payload: locations });
  }, []);

  const clearLocations = useCallback(() => {
    dispatch({ type: 'CLEAR_LOCATIONS' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const resetMap = useCallback(() => {
    dispatch({ type: 'RESET_MAP' });
  }, []);

  // Context value
  const contextValue: MapContextType = {
    mapState: state.mapState,
    corruptionLocations: state.corruptionLocations,
    selectedLocation: state.selectedLocation,
    setMapCenter,
    setMapZoom,
    selectLocation,
    addCorruptionLocation,
    updateCorruptionLocation,
    clearLocations,
    setLoading,
    setError,
  };

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
};

// Custom hook to use the map context
export const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

// Export for convenience
export default MapContext;