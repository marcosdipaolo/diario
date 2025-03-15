const { StorageClient } = require('@supabase/storage-js');
const { v4: uuidV4 } = require("uuid");

module.exports = {
  init(config) {
    const supabaseClient = new StorageClient(config.supabaseUrl, {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${config.supabaseKey}`,
    });
    const { images, audio } = config.buckets;

    console.log({ images, audio });

    return {
      async upload(file) {
        // Determine bucket based on file type
        const bucket = file.mime.startsWith('audio') ? audio : images;
        const { stream, mime } = file
        const filename = file.hash + file.ext;

        const { data, error } = await supabaseClient
          .from(bucket)
          .upload(filename, stream, {
            contentType: mime,
            duplex: "half"
          });
        if (error) throw new Error(error?.error);

        file.url = `${config.supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;
      },

      async uploadStream(file) {
        const bucket = file.mime.startsWith('audio') ? audio : images;
        const { hash, ext: extension, mime } = file;
        const filename = `${hash}${extension}`;

        
        const fileStream = file.getStream ? file.getStream() : file.stream;
      
        if (!fileStream) {
          console.error("🚨 File stream is missing!");
          return;
        }
      
        const { data, error } = await supabaseClient
          .from(bucket)
          .upload(filename, fileStream, {
            contentType: mime,
            duplex: "half"
          });
      
        console.log("🛠 Upload response:", { data });
      
        if (error) {
          throw new Error(error?.error);
        }
      
        file.url = `${config.supabaseUrl}/object/public/${bucket}/${data.path}`;
      },

      async delete(file) {
        const bucket = file.mime.startsWith('audio') ? audio : images;

        const { error } = await supabaseClient
          .from(bucket)
          .remove([file.hash + file.ext]);

        if (error) throw error;
      },
    };
  },
};