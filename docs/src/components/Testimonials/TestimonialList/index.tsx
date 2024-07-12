import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import TestimonialItem from '@site/src/components/Testimonials/TestimonialItem';

const items = [
  {
    author: 'Test author',
    company: 'Test',
    body: 'Screens are the best ever and ever - I love using it!',
    link: 'https://test.com/',
    image: {
      alt: 'test',
      src: '/img/logo.svg',
    },
  },
  {
    author: 'Test author',
    company: 'Test',
    body: 'Screens are the best ever and ever - I love using it!',
    link: 'https://test.com/',
    image: {
      alt: 'test',
      src: '/img/logo.svg',
    },
  },
  {
    author: 'Test author',
    company: 'Test',
    body: 'Screens are the best ever and ever - I love using it!',
    link: 'https://test.com/',
    image: {
      alt: 'test',
      src: '/img/logo.svg',
    },
  },
];

const TestimonialList = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const testimonialContainer = document.querySelector<HTMLElement>(
        `.testimonialContainer-${activeIndex}`
      );
      const testimonialSlides =
        document.querySelector<HTMLElement>('.testimonialSlides');
      if (
        testimonialContainer.childElementCount === 1 &&
        testimonialSlides.offsetHeight > testimonialContainer.offsetHeight
      ) {
        return;
      }
      testimonialSlides.style.height = `${testimonialContainer.offsetHeight}px`;
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [activeIndex]);

  const handleDotClick = index => {
    setActiveIndex(index);
  };

  const renderedItems = [];
  for (let i = 0; i < items.length; i += 2) {
    renderedItems.push(
      <div
        className={clsx(
          `testimonialContainer-${i / 2}`,
          styles.testimonialPair
        )}
        key={i}>
        <TestimonialItem
          company={items[i].company}
          image={items[i].image}
          link={items[i].link}
          author={items[i].author}>
          {items[i].body}
        </TestimonialItem>
        {i + 1 < items.length && (
          <TestimonialItem
            company={items[i + 1].company}
            image={items[i + 1].image}
            link={items[i + 1].link}
            author={items[i + 1].author}>
            {items[i + 1].body}
          </TestimonialItem>
        )}
      </div>
    );
  }

  return (
    <div className={styles.testimonialSlides}>
      <div className="testimonialSlides">
        {renderedItems.map((item, idx) => (
          <div
            key={idx}
            className={clsx(
              styles.testimonialSlide,
              activeIndex === idx ? styles.activeTestimonialSlide : ''
            )}>
            {item}
          </div>
        ))}
      </div>
      <div className={styles.dotsContainer}>
        {renderedItems.map((_, idx) => (
          <span
            key={idx}
            className={clsx(
              styles.dot,
              idx === activeIndex && styles.activeDot
            )}
            onClick={() => handleDotClick(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialList;
