/** @type {import('react-email').ReactEmailConfig} */
module.exports = {
  // Directory where your email templates are located
  dir: './src/emails',
  
  // Port for the email preview server
  port: 3001,
  
  // Whether to open the preview in browser automatically
  open: true,
  
  // Custom CSS for the preview
  css: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `,
};