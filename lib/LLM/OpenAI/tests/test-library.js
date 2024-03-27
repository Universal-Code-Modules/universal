const getCurrentWeather = ({location, unit = "fahrenheit"}) => {
    if (location.toLowerCase().includes("tokyo")) {
      return JSON.stringify({ location: "Tokyo", temperature: "10", unit: "celsius" });
    } else if (location.toLowerCase().includes("san francisco")) {
      return JSON.stringify({ location: "San Francisco", temperature: "72", unit: "fahrenheit" });
    } else if (location.toLowerCase().includes("paris")) {
      return JSON.stringify({ location: "Paris", temperature: "22", unit: "fahrenheit" });
    } else {
      return JSON.stringify({ location, temperature: "unknown" });
    }
  }
  const getCurrentAge = ({location, unit = "years"}) => {
    if (location.toLowerCase().includes("tokyo")) {
      return JSON.stringify({ location: "Tokyo", age: "10", unit: "years" });
    } else if (location.toLowerCase().includes("san francisco")) {
      return JSON.stringify({ location: "San Francisco", age: "72", unit: "years" });
    } else if (location.toLowerCase().includes("paris")) {
      return JSON.stringify({ location: "Paris", age: "22", unit: "years" });
    } else {
      return JSON.stringify({ location, temperature: "unknown" });
    }
  }

  const tools = [{
    // name: "get_current_weather",
    
    fn: getCurrentWeather,
    scope: this,
    description: "Get the current weather in a given location",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g. San Francisco, CA",
      },
      unit: { type: "string", enum: ["celsius", "fahrenheit"] },
    },
    required: ["location"]
  },
  {
    // name: "get_current_weather",
    
    fn: getCurrentAge,
    scope: this,
    description: "Get the current population average age in a given location",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g. San Francisco, CA",
      },
      unit: { type: "string", enum: ["years", "days"] },
    },
    required: ["location"]
  }];

module.exports = {getCurrentWeather, getCurrentAge, tools}