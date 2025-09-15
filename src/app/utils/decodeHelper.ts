// Function to decode HTML entities
export function decodeHtmlEntities(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8216;': "'",
    '&#8217;': "'",
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8230;': '...',
    '&quot;': '"',
    '&apos;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&nbsp;': ' ',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2019;': "'",
    '&#x201C;': '"',
    '&#x201D;': '"'
  };

  let decodedText = text;
  for (const [entity, replacement] of Object.entries(htmlEntities)) {
    decodedText = decodedText.replace(new RegExp(entity, 'g'), replacement);
  }

  // Handle numeric HTML entities
  decodedText = decodedText.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  // Handle hexadecimal HTML entities
  decodedText = decodedText.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decodedText;
}