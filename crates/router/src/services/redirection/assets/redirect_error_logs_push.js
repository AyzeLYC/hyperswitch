function parseRoute(url) {
    
    const route = new URL(url).pathname,
         regex = /^\/payments\/redirect\/([^/]+)\/([^/]+)\/([^/]+)$|^\/payments\/([^/]+)\/([^/]+)\/redirect\/response\/([^/]+)(?:\/([^/]+)\/?)?$|^\/payments\/([^/]+)\/([^/]+)\/redirect\/complete\/([^/]+)$/,
         matches = route.match(regex),
         attemptIdExists = !(route.includes("response") || route.includes("complete"));
    
    if (matches) {
        
      const [, paymentId, merchantId, attemptId, connector,credsIdentifier] = matches;
      
      return { paymentId, merchantId, attemptId: attemptIdExists ? attemptId : "", connector };
        
    } else {
    
      return { paymentId: "", merchantId: "", attemptId: "", connector: "",
      };
        
    };
    
  };

  function getEnvRoute(url) {
      
    const route = new URL(url).hostname;
      
    return route === "api.hyperswitch.io" ? "https://api.hyperswitch.io/logs/redirection" : "https://sandbox.hyperswitch.io/logs/redirection";
      
};

  
async function postLog(log, urlToPost) {

    try {
        
        const response = await fetch(urlToPost, { method: "POST", mode: "no-cors", body: JSON.stringify(log), headers: { 'Accept': "application/json", "Content-Type": "application/json" } });
    
    } catch (err) {
        
        console.error(`Error in logging: ${err}`);
        
    };
    
};
  
  
window.addEventListener("error", (event) => {
    
    let url = window.location.href,
        { paymentId, merchantId, attemptId, connector } = parseRoute(url),
        urlToPost = getEnvRoute(url),
        log = { message: event.message, url, paymentId, merchantId, attemptId, connector };
    
    postLog(log, urlToPost);
    
});
  
window.addEventListener("message", (event) => {
    
    let url = window.location.href,
        { paymentId, merchantId, attemptId, connector } = parseRoute(url),
        urlToPost = getEnvRoute(url),
        log = { message: event.data, url, paymentId, merchantId, attemptId, connector};
    
    postLog(log, urlToPost);
    
});
