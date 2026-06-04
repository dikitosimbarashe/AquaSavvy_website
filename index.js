const React = require('react');
const ReactDOMServer = require('react-dom/server');
const AquaSavvyWebsite = require('./dist/index.js').default;

// Mock props
const props = {
  onAdminLogin: () => console.log('Admin login clicked'),
  onGetStarted: () => console.log('Get started clicked'),
  onBackToApp: () => console.log('Back to app clicked'),
  onMarketClick: () => console.log('Market clicked')
};

const element = React.createElement(AquaSavvyWebsite, props);
const html = ReactDOMServer.renderToString(element);

console.log(html);