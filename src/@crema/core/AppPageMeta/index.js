import React from 'react';
import PropTypes from 'prop-types';
import {NextSeo} from 'next-seo';

const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://qa-blog.mastersindia.co';

const defaultTitle = 'TuNexo - Facturación Digital e Inventarios';
const defaultDescription =
  'Software para la administración de inventarios, e-commerce y facturación electrónica';
const defaultImage =
  'https://cdn.mastersindia.co/custom_pages/img/Masters India_GST_Software.svg';
const defaultTwitter = '@crema';
const defaultSep = ' | ';

const AppPage = ({children, ...rest}) => {
  const {
    title,
    description,
    image,
    category = 'Admin Theme',
    tags = ['Material Admin', 'MUI Nextjs'],
  } = rest;
  const theTitle = title
    ? title?.length > 48
      ? title
      : title + defaultSep + defaultTitle
    : defaultTitle;
  const theDescription = description
    ? description.substring(0, 155)
    : defaultDescription;
  const theImage = 'https://www.tunexo.pe/img/acerca_TuNexo.png'; //image ? `${SITE_URL}${image}` : defaultImage;
  console.log('theImage:' + theImage);
  return (
    <>
      <NextSeo
        title={theTitle}
        description={theDescription}
        canonical='https://www.canonical.ie/'
        openGraph={{
          url: 'https://www.url.ie/a',
          title: theTitle,
          description: theDescription,
          images: [
            {
              url: theImage,
              width: 800,
              height: 600,
              alt: 'Crema Admin Template',
              type: 'image/jpeg',
            },
            {
              url: theImage,
              width: 900,
              height: 800,
              alt: 'Crema Admin Template',
              type: 'image/jpeg',
            },
          ],
          site_name: 'Crema Admin Template',
        }}
        tags={tags}
        category={category}
        twitter={{
          handle: defaultTwitter,
          site: '@crema',
          cardType: 'summary_large_image',
        }}
      />
      {children}
    </>
  );
};

export default AppPage;

AppPage.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};
