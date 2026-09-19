type LegalPageSchemaProps = {
  name: string;
  description: string;
  path: string;
};

export default function LegalPageSchema({ name, description, path }: LegalPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://takimia.com${path}#webpage`,
    url: `https://takimia.com${path}`,
    name,
    description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://takimia.com/#website',
      url: 'https://takimia.com',
      name: 'Takimia',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://takimia.com/#organization',
      name: 'Takimia',
      url: 'https://takimia.com',
      email: 'contact@takimia.com',
      telephone: '+1 (786) 302-5205',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '680 N Golden Key St',
        addressLocality: 'Gilbert',
        addressRegion: 'AZ',
        postalCode: '85233',
        addressCountry: 'US',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
