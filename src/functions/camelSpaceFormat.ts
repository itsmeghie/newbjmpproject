export const camelSpaceFormat = (text: string): string => {
    return text
      .split("_") 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" "); 
  };
