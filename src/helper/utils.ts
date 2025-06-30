function isNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }
  
  type ExtractedError = {
    status?: number;
    messages: string[];
  };
  
  export function extractErrors(error: any): ExtractedError {
    const genericMessage = 'Something went wrong. Please try again later.';
  
    if (!error || typeof error !== 'object') {
      return { messages: [genericMessage] };
    }
  
    const messages: string[] = [];
  
    if (error.error?.errors && Array.isArray(error.error.errors)) {
      messages.push(...error.error.errors);
    } else if (typeof error.message === 'string') {
      messages.push(error.message);
    } else if (typeof error.error?.message === 'string') {
      messages.push(error.error.message);
    } else if (Array.isArray(error.errors)) {
      messages.push(...error.errors);
    }
  
    return {
      status: error.status,
      messages: messages.length > 0 ? messages : [genericMessage],
    };
  }
  
  
  export const jsonToUriParam = <T extends Record<string, any>>(
    jsonData: T,
    prefix = ""
  ): string => {
    const params: string[] = [];
  
    const encodeWithType = (key: string, value: any) => {
      let typeIndicator = "s"; // default type is string ('s')
      if (typeof value === "number") typeIndicator = "n";
      else if (typeof value === "boolean") typeIndicator = "b";
  
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        `${String(value)}:${typeIndicator}`
      )}`;
    };
  
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const value = jsonData[key];
        const paramKey = prefix ? `${prefix}[${key}]` : key;
  
        if (value && typeof value === "object" && !Array.isArray(value)) {
          params.push(jsonToUriParam(value, paramKey)); // Recursive call for nested objects
        } else if (Array.isArray(value)) {
          value.forEach((item: any, index: number) => {
            const nestedKey = `${paramKey}[${index}]`;
            if (item && typeof item === "object") {
              params.push(jsonToUriParam(item, nestedKey)); // Recursive call for nested arrays
            } else {
              params.push(encodeWithType(nestedKey, item));
            }
          });
        } else {
          params.push(encodeWithType(paramKey, value));
        }
      }
    }
  
    return params.join("&");
  };
  
  type FilterOperator =
    | "="
    | "!="
    | "ilike"
    | "like"
    | "between"
    | ">"
    | ">="
    | "<"
    | "<="
    | "in"
    | "or"
    | "and";
  
  interface FilterType {
    key: string;
    operator: FilterOperator;
    value: string | string[] | FilterType[];
  }
  
  interface SearchType {
    keys: string[];
    value: string;
  }
  
  interface OrderType {
    key: string;
    value: "ASC" | "DESC";
    literal?: boolean;
  }
  
  interface IncludeInputType {
    model: string;
    alias?: string;
    filter?: FilterType[];
    include?: IncludeInputType[];
  }
  
  type QueryParams = {
    offset?: number;
    limit?: number;
    filter?: FilterType[];
    search?: SearchType;
    order?: OrderType[];
    include?: IncludeInputType[];
    paranoid?: boolean;
    sortQuery?: boolean;
  };
  
  type Sortable = {
    state: "ASC" | "DESC" | undefined;
    key: string;
  };
  
  type Pagination = {
    page: number;
    pageSize?: number;
  };
  
  export function setupParams(props: {
    keys: string[];
    pagination?: Pagination;
    searchQuery?: string;
    filterQuery?: FilterType[];
    sortState?: Sortable[];
    include?: IncludeInputType[];
    paranoid?: boolean;
    SortQuery?: boolean;
  }): QueryParams {
    let params: QueryParams = {
      offset: 0,
      limit: 40,
    };
    if (props.pagination) {
      params = {
        ...params,
        offset: (props.pagination.page - 1) * (props.pagination.pageSize ?? 10),
        limit: props.pagination.pageSize ?? 10,
      };
    }
  
    if (props.include) {
      params = {
        ...params,
        include: props.include,
      };
    }
  
    if (props.paranoid) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.SortQuery !== undefined && props.SortQuery !== null) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.searchQuery) {
      params = {
        ...params,
        search: { keys: props.keys, value: props.searchQuery },
      };
    }
    if (props.filterQuery && props.filterQuery.length > 0) {
      params = {
        ...params,
        filter: props.filterQuery,
      };
    }
    if (props.sortState && props.sortState.length > 0) {
      let state = [
        ...props.sortState
          .filter((sort) => sort.state !== undefined)
          .map((sort) => ({ key: sort.key, value: sort.state ?? "ASC" })),
      ];
      if (state.length > 0) {
        params = {
          ...params,
          order: state,
        };
      }
    }
  
    return params;
  }
  function setupParamsnolimit(props: {
    keys: string[];
    pagination?: Pagination;
    searchQuery?: string;
    filterQuery?: FilterType[];
    sortState?: Sortable[];
    include?: IncludeInputType[];
    paranoid?: boolean;
    SortQuery?: boolean;
  }): QueryParams {
    let params: QueryParams = {
      offset: 0,
      limit: -1,
    };
    if (props.pagination) {
      params = {
        ...params,
        offset: (props.pagination.page - 1) * (props.pagination.pageSize ?? 10),
        limit: props.pagination.pageSize ?? 10,
      };
    }
  
    if (props.include) {
      params = {
        ...params,
        include: props.include,
      };
    }
  
    if (props.paranoid) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.SortQuery !== undefined && props.SortQuery !== null) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.searchQuery) {
      params = {
        ...params,
        search: { keys: props.keys, value: props.searchQuery },
      };
    }
    if (props.filterQuery && props.filterQuery.length > 0) {
      params = {
        ...params,
        filter: props.filterQuery,
      };
    }
    if (props.sortState && props.sortState.length > 0) {
      let state = [
        ...props.sortState
          .filter((sort) => sort.state !== undefined)
          .map((sort) => ({ key: sort.key, value: sort.state ?? "ASC" })),
      ];
      if (state.length > 0) {
        params = {
          ...params,
          order: state,
        };
      }
    }
  
    return params;
  }
  function setupParamsSubscription(props: {
    keys: string[];
    pagination?: Pagination;
    searchQuery?: string;
    filterQuery?: FilterType[];
    sortState?: Sortable[];
    include?: IncludeInputType[];
    paranoid?: boolean;
    SortQuery?: boolean;
  }): QueryParams {
    let params: QueryParams = {
      offset: 0,
      limit: -1,
    };
    if (props.pagination) {
      params = {
        ...params,
        offset: (props.pagination.page - 1) * (props.pagination.pageSize ?? 10),
        limit: props.pagination.pageSize ?? 10,
      };
    }
  
    if (props.include) {
      params = {
        ...params,
        include: props.include,
      };
    }
  
    if (props.paranoid) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.SortQuery !== undefined && props.SortQuery !== null) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.searchQuery) {
      params = {
        ...params,
        search: { keys: props.keys, value: props.searchQuery },
      };
    }
    if (props.filterQuery && props.filterQuery.length > 0) {
      params = {
        ...params,
        filter: props.filterQuery,
      };
    }
    if (props.sortState && props.sortState.length > 0) {
      let state = [
        ...props.sortState
          .filter((sort) => sort.state !== undefined)
          .map((sort) => ({ key: sort.key, value: sort.state ?? "ASC" })),
      ];
      if (state.length > 0) {
        params = {
          ...params,
          order: state,
        };
      }
    }
  
    return params;
  }
  function setupParams2(props: {
    keys: string[];
    pagination?: Pagination;
    searchQuery?: string;
    filterQuery?: FilterType[];
    sortState?: Sortable[];
    include?: IncludeInputType[];
    paranoid?: boolean;
    SortQuery?: boolean;
  }): QueryParams {
    let params: QueryParams = {
      offset: 0,
      limit: 10,
    };
    if (props.pagination) {
      params = {
        ...params,
        offset: (props.pagination.page - 1) * (props.pagination.pageSize ?? 10),
        limit: props.pagination.pageSize ?? 10,
      };
    }
  
    if (props.include) {
      params = {
        ...params,
        include: props.include,
      };
    }
  
    if (props.paranoid) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.SortQuery !== undefined && props.SortQuery !== null) {
      params = {
        ...params,
        paranoid: props.paranoid,
      };
    }
    if (props.searchQuery) {
      params = {
        ...params,
        search: { keys: props.keys, value: props.searchQuery },
      };
    }
    if (props.filterQuery && props.filterQuery.length > 0) {
      params = {
        ...params,
        filter: props.filterQuery,
      };
    }
    if (props.sortState && props.sortState.length > 0) {
      let state = [
        ...props.sortState
          .filter((sort) => sort.state !== undefined)
          .map((sort) => ({ key: sort.key, value: sort.state ?? "ASC" })),
      ];
      if (state.length > 0) {
        params = {
          ...params,
          order: state,
        };
      }
    }
  
    return params;
  }
  const uriParamToJson = <T extends Record<string, any>>(uri: string): T => {
    const jsonData: any = {};
  
    const decodeWithType = (value: string): any => {
      const [actualValue, typeIndicator] = value.split(":");
      switch (typeIndicator) {
        case "b":
          return actualValue === "true";
        case "n":
          return parseFloat(actualValue);
        case "s":
        default:
          return actualValue;
      }
    };
  
    const decodeParam = (keys: string[], value: string) => {
      let current = jsonData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = decodeWithType(value); // Decode and assign value at the final key
        } else {
          current = current[key] =
            current[key] || (isNaN(Number(keys[index + 1])) ? {} : []); // Create nested object or array
        }
      });
    };
  
    uri.split("&").forEach((param) => {
      const [encodedKey, encodedValue] = param.split("=");
      const key = decodeURIComponent(encodedKey);
      const value = decodeURIComponent(encodedValue);
  
      // Corrected: Removed unnecessary escape for ]
      const keys = key.replace(/]/g, "").split("["); // Split key into nested levels
      decodeParam(keys, value);
    });
  
    return jsonData as T;
  };
  
  export function buildQueryParams(page: number, pageSize: number): string {
    const queryParams = setupParams({
      pagination: { pageSize, page },
      keys: [],
      include: [

      ],
    });
  
    const queryParamString = jsonToUriParam(queryParams);
  
    return `query=${encodeURIComponent(queryParamString)}`;
  }
  