import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample blog post with headings...');

  // Find admin user
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (!admin) {
    console.error('❌ No admin user found. Please run the main seed first.');
    return;
  }

  // Sample post content with all heading levels
  const sampleContent = `
<h1>Heading 1: Main Title</h1>
<p>This is a paragraph under H1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

<h2>Heading 2: Major Section</h2>
<p>This section introduces a major topic. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<h3>Heading 3: Subsection</h3>
<p>This is a subsection with more detailed information. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

<h4>Heading 4: Minor Topic</h4>
<p>Even more specific details here. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>

<h5>Heading 5: Detail Point</h5>
<p>A very specific point of discussion. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</p>

<h6>Heading 6: Sub-detail</h6>
<p>The most granular level of content structure. Deserunt mollit anim id est laborum.</p>

<h2>Another Major Section</h2>
<p>Demonstrating multiple sections at the same level.</p>

<h3>Another Subsection</h3>
<p>With its own content and structure.</p>

<h4>Code Example</h4>
<pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>

<h3>Lists and More</h3>
<ul>
  <li>Bullet point one</li>
  <li>Bullet point two</li>
  <li>Bullet point three</li>
</ul>

<h2>Conclusion</h2>
<p>This post demonstrates all heading levels from H1 to H6, which will be used to generate a beautiful table of contents in the sidebar!</p>
`;

  // Create or update sample post
  const existingPost = await prisma.post.findFirst({
    where: {
      title: 'Sample Post with All Headings',
    },
  });

  if (existingPost) {
    console.log('✅ Sample post already exists, updating...');
    await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        content: sampleContent,
        status: 'published',
      },
    });
  } else {
    console.log('✅ Creating new sample post...');
    await prisma.post.create({
      data: {
        title: 'Sample Post with All Headings',
        excerpt: 'This post demonstrates all heading levels (H1-H6) for table of contents generation.',
        content: sampleContent,
        authorId: admin.id,
        status: 'published',
        readTime: 5,
      },
    });
  }

  console.log('✅ Sample post created successfully!');
  console.log('📝 Title: Sample Post with All Headings');
  console.log('👤 Author:', admin.name || admin.email);
}

main()
  .catch((error) => {
    console.error('❌ Error seeding sample post:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
