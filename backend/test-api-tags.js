const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/posts',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const posts = JSON.parse(data);
      if (posts && posts.length > 0) {
        const firstPost = posts[0];
        console.log('\n=== First Post ===');
        console.log('ID:', firstPost.id);
        console.log('Title:', firstPost.title);
        console.log('Tags field exists:', 'tags' in firstPost);
        console.log('Tags value:', firstPost.tags);
        console.log('Tags type:', typeof firstPost.tags);
        console.log('Tags is array:', Array.isArray(firstPost.tags));
        console.log('\n=== Full Post Object ===');
        console.log(JSON.stringify(firstPost, null, 2));
      } else {
        console.log('No posts found');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
