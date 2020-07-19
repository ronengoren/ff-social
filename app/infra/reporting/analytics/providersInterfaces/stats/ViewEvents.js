class ViewEvents {
  constructor(provider) {
    this.provider = provider;
  }

  postsViews = ({ posts }) => {
    this.provider.log({
      entityName: 'posts',
      eventName: 'views',
      data: posts.map((post) => `${post.id}:${post.timestamp}`).join(',')
    });
  };
}

export default ViewEvents;
