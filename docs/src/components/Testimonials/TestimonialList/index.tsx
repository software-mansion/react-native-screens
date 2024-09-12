import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import TestimonialItem from '@site/src/components/Testimonials/TestimonialItem';

const items = [
  {
    author: 'Satyajit Sahoo',
    company: 'Callstack',
    body: "React Navigation wouldn't be the same today without React Native Screens. Gotta give kudos to the Screens team for bringing native navigation with a nice API. And they are always hard at work to bring more native features as well!",
    link: 'https://x.com/satya164/status/1826694902660694028',
    image: {
      alt: 'satya',
      src: 'https://pbs.twimg.com/profile_images/1426585051379159040/RG8CUmff_400x400.jpg',
    },
  },
  {
    author: 'Ferran Negre Pizzaro',
    company: 'FitHero',
    body: 'I would never build a serious React Native app without it.',
    link: 'https://x.com/ferrannp/status/1826734343571796317',
    image: {
      alt: 'ferran',
      src: 'https://pbs.twimg.com/profile_images/1225546442917515264/OBZyRYWO_400x400.jpg',
    },
  },
  {
    author: 'Sébastien Lorber',
    company: 'This Week In React',
    body: 'React Native Screens is what makes React Native navigation truly competitive against native apps',
    link: 'https://x.com/sebastienlorber/status/1828760445106466959',
    image: {
      alt: 'seb',
      src: 'https://pbs.twimg.com/profile_images/573206276819140608/gKAusMeX_400x400.jpeg',
    },
  },
  {
    author: 'Jamon Holmgren',
    company: 'Infinite Red',
    body: 'React Native Screens is one of the most underrated React Native libraries!',
    link: 'https://x.com/jamonholmgren/status/1826713786797228166',
    image: {
      alt: 'jamon',
      src: 'https://pbs.twimg.com/profile_images/1712505856905170944/LDFMYGSQ_400x400.jpg',
    },
  },
  {
    author: 'Kwesi Kay',
    body: "React Native Screens has been a game-changer for me! It optimizes performance by reducing memory usage and makes navigation smoother, especially in large apps. Couldn't imagine building without it now! 😍",
    link: 'https://x.com/EiiKwesiKay/status/1826282042965000267',
    image: {
      alt: 'kwesikay',
      src: 'https://pbs.twimg.com/profile_images/1823345356794449920/UVMh-ABt_400x400.jpg',
    },
  },
  {
    author: 'Brent Vatne',
    company: 'Expo',
    body: "react-native-screens is one of the most essential libraries in the ecosystem. it's a crucial building block for react-navigation and expo-router, and therefore nearly all react-native apps! native stack in particular does tons of heavy lifting to make your apps feel fantastic.",
    link: 'https://x.com/notbrent/status/1826699409738137796',
    image: {
      alt: 'brent',
      src: 'https://pbs.twimg.com/profile_images/1509282922498428929/gV2uTCff_400x400.jpg',
    },
  },
];

const TestimonialList = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const testimonialContainer = document.querySelector<HTMLElement>(
        `.testimonialContainer-${activeIndex}`,
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
          styles.testimonialPair,
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
      </div>,
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
              activeIndex === idx ? styles.activeTestimonialSlide : '',
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
              idx === activeIndex && styles.activeDot,
            )}
            onClick={() => handleDotClick(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialList;
