// Mock corruption news data for demonstration and fallback
export const MOCK_CORRUPTION_NEWS = [
  {
    title: "Senate Blue Ribbon Committee investigates alleged overpricing in Department of Public Works projects",
    content: "The Senate Blue Ribbon Committee has launched a comprehensive investigation into alleged overpricing and irregularities in infrastructure projects worth billions of pesos under the Department of Public Works and Highways. Committee Chairman Senator Richard Gordon said the investigation will look into contracts awarded without proper bidding procedures and potential kickbacks to government officials. The probe was triggered by a Commission on Audit report that flagged several anomalous transactions.",
    url: "https://example.com/senate-investigation-dpwh",
    source: "Senate News",
    publishedAt: new Date().toISOString(),
    imageUrl: "https://example.com/images/senate.jpg"
  },
  {
    title: "Ombudsman files multiple graft charges against former city mayor for ghost employees scheme",
    content: "The Office of the Ombudsman has filed graft and corruption charges against a former city mayor and several municipal employees for allegedly maintaining ghost employees on the city payroll. The scheme, which ran for three years, resulted in the misappropriation of over 50 million pesos in public funds. Ombudsman Samuel Martires said the case involves violations of the Anti-Graft and Corrupt Practices Act and malversation of public funds.",
    url: "https://example.com/ombudsman-ghost-employees",
    source: "Ombudsman Office",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: "https://example.com/images/ombudsman.jpg"
  },
  {
    title: "COA flags 2.3 billion pesos in irregular expenditures across multiple government agencies",
    content: "The Commission on Audit has flagged irregular financial transactions amounting to 2.3 billion pesos across various government agencies in its latest annual report. The audit findings include procurement violations, lack of supporting documents, and questionable disbursements. COA Chairperson Michael Aguinaldo emphasized the need for stricter compliance with procurement rules and proper documentation of government expenditures.",
    url: "https://example.com/coa-irregular-expenditures",
    source: "COA Reports",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: "https://example.com/images/coa.jpg"
  },
  {
    title: "Sandiganbayan convicts former provincial governor of plunder in fertilizer fund scam",
    content: "The Sandiganbayan has convicted a former provincial governor of plunder in connection with the misuse of fertilizer funds intended for farmers. The anti-graft court found the defendant guilty of diverting 200 million pesos meant for agricultural support programs to personal accounts and fictitious projects. The case is part of the larger fertilizer fund scam that implicated several local government officials nationwide.",
    url: "https://example.com/sandiganbayan-fertilizer-scam",
    source: "Sandiganbayan",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    imageUrl: "https://example.com/images/sandiganbayan.jpg"
  },
  {
    title: "Anti-corruption drive intensifies as President orders lifestyle checks on all government officials",
    content: "President Ferdinand Marcos Jr. has ordered comprehensive lifestyle checks on all government officials as part of his administration's intensified anti-corruption campaign. The directive requires officials to submit updated Statements of Assets, Liabilities and Net Worth (SALN) and undergo scrutiny of their lifestyle and expenditures. The Civil Service Commission will coordinate with the Ombudsman to implement the directive across all government agencies.",
    url: "https://example.com/lifestyle-checks-directive",
    source: "Presidential Communications Office",
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    imageUrl: "https://example.com/images/pco.jpg"
  }
];