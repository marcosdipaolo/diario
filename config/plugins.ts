export default ({env}) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-supabase', // Match the provider name
      providerOptions: {
        supabaseUrl: env('SUPABASE_URL'),
        supabaseKey: env('SUPABASE_SERVICE_ROLE_KEY'),
        buckets: {
          images: env('SUPABASE_IMAGES_BUCKET'),
          audio: env('SUPABASE_AUDIO_BUCKET'),
        },
      },
    },
  },
});
