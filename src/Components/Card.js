import React, { useContext } from 'react';
import { formatTime, sortPost } from '../helpers/utils';
import { placeholderImage } from '../helpers/keys';
import PostContext from '../contexts/PostContext';

export default function CardComponent() {
  const { post } = useContext(PostContext);
  // const { articles: post } = useContext(PostContext);

  const articles = post.news;
  // console.log('post -', articles);

  return (
    <div className='card'>
      <>
        {articles.length === 0 && <div> No articles found! </div>}
        {sortPost(articles) &&
          articles.map((article) => (
            <div key={article.id} className='cardItem'>
              <h4 className='title'>{article.title}</h4>
              <div className='image'>
                <img
                  src={
                    article.image === 'None' ? placeholderImage : article.image
                  }
                  alt=' Oops!, sorry an error occurred while fetching the image'
                />
              </div>
              <div>
                <p style={{ marginTop: 5 }}>{formatTime(article.published)}</p>
              </div>
              <div>
                <a href={article.url} style={{ marginTop: 5 }} target='_blank'>
                  Read more
                </a>
              </div>
            </div>
          ))}
      </>
    </div>
  );
}
