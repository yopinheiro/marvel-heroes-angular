export interface Character {
    code: number;  // Deveria ser 'number' ao invés de 'int'
    status: string;
    copyright: string;
    attributionText: string;
    attributionHTML: string;
    data: {
      offset: number;  // Deveria ser 'number' ao invés de 'int'
      limit: number;   // Deveria ser 'number' ao invés de 'int'
      total: number;   // Deveria ser 'number' ao invés de 'int'
      count: number;   // Deveria ser 'number' ao invés de 'int'
      results: CharacterResult[];  // Altere para o tipo correto
    };
    etag: string;
  }
  
  export interface CharacterResult {
    id: number;
    name: string;
    description: string;
    modified: Date;
    resourceURI: string;
    urls: {
      type: string;
      url: string;
    }[];
    thumbnail: {
      path: string;
      extension: string;
    };
    comics: {
      available: number;
      returned: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
      }[];
    };
    stories: {
      available: number;
      returned: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
        type: string;
      }[];
    };
    events: {
      available: number;
      returned: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
      }[];
    };
    series: {
      available: number;
      returned: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
      }[];
    };
  }
  