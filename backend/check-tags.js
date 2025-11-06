const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== Checking post_tags table ===');
  
  const postTags = await prisma.postTag.findMany({
    include: {
      posts: { select: { title: true } },
      tags: { select: { name: true } },
    },
  });
  
  console.log('Total post-tag associations:', postTags.length);
  postTags.forEach(pt => {
    console.log(`  - Post "${pt.posts.title}" has tag "${pt.tags.name}"`);
  });
  
  console.log('\n=== Checking posts with tags ===');
  const posts = await prisma.post.findMany({
    include: {
      post_tags: {
        include: {
          tags: true,
        },
      },
    },
  });
  
  posts.forEach(post => {
    console.log(`Post: ${post.title}`);
    console.log(`  Tags count: ${post.post_tags.length}`);
    post.post_tags.forEach(pt => {
      console.log(`    - ${pt.tags.name} (${pt.tags.slug})`);
    });
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
