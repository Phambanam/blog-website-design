const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test post with tags...');
  
  // Get existing tags
  const tags = await prisma.tag.findMany({ take: 2 });
  
  if (tags.length < 2) {
    console.error('Need at least 2 tags in database. Please create tags first.');
    return;
  }
  
  // Get admin user
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  
  if (!admin) {
    console.error('No admin user found');
    return;
  }
  
  // Create post
  const post = await prisma.post.create({
    data: {
      title: 'Test Post with Tags',
      excerpt: 'Testing tag associations',
      content: '<p>This is a test post with tags</p>',
      authorId: admin.id,
      status: 'published',
    },
  });
  
  console.log('Created post:', post.id, post.title);
  
  // Create tag associations
  await prisma.postTag.createMany({
    data: tags.map(tag => ({
      post_id: post.id,
      tag_id: tag.id,
    })),
  });
  
  console.log(`Associated ${tags.length} tags with the post`);
  
  // Verify
  const postWithTags = await prisma.post.findUnique({
    where: { id: post.id },
    include: {
      post_tags: {
        include: {
          tags: true,
        },
      },
    },
  });
  
  console.log('\nPost with tags:');
  console.log('Title:', postWithTags.title);
  console.log('Tags:');
  postWithTags.post_tags.forEach(pt => {
    console.log(`  - ${pt.tags.name} (${pt.tags.slug})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
