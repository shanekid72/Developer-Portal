declare module 'swagger-ui-react' {
  import React from 'react';
  
  export interface SwaggerUIProps {
    url?: string;
    spec?: object;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    deepLinking?: boolean;
    filter?: boolean | string;
    persistAuthorization?: boolean;
    displayOperationId?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    displayRequestDuration?: boolean;
    docExpansion?: 'list' | 'full' | 'none';
    filter?: boolean | string;
    maxDisplayedTags?: number;
    operationsSorter?: (a: any, b: any) => number;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    tagSorter?: (a: any, b: any) => number;
    onComplete?: () => void;
    requestInterceptor?: (req: any) => any;
    responseInterceptor?: (res: any) => any;
    showMutatedRequest?: boolean;
    supportedSubmitMethods?: Array<string>;
    validatorUrl?: string | null;
    withCredentials?: boolean;
    tryItOutEnabled?: boolean;
    presets?: Array<any>;
    plugins?: Array<any>;
  }
  
  const SwaggerUI: React.ComponentType<SwaggerUIProps>;
  
  export default SwaggerUI;
}

declare module 'swagger-ui-dist' {
  export function absolutePath(): string;
} 