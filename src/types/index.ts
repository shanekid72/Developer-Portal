export interface APIEndpoint {
  id: string;
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'SECTION';
  path: string;
  description: string;
  parameters?: Parameter[];
  pathParams?: PathParameter[];
  queryParams?: QueryParameter[];
  requestHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  responses: Response[];
  codeExamples: CodeExample[];
  guidelines?: string;
  errorCodes?: string;
  isCollapsible?: boolean;
  isSection?: boolean;
  nestedEndpoints?: APIEndpoint[];
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  in?: string; // Adding 'in' property to support query parameters
  example?: string;
}

export interface PathParameter {
  name: string;
  description: string;
  required: boolean;
}

export interface QueryParameter {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

export interface RequestBody {
  type: string;
  description: string;
  schema: Record<string, any>;
  example?: Record<string, any>;
}

export interface Response {
  status: number;
  description: string;
  schema?: Record<string, any>;
  example?: Record<string, any>;
}

export interface CodeExample {
  language: string;
  label: string;
  code: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: string;
  children?: NavigationItem[];
  isExpanded?: boolean;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  apiVersion: string;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface TryItRequest {
  endpoint: APIEndpoint;
  parameters: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
} 