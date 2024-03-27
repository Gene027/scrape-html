import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';

interface FormData {
  touched: boolean;
  error: string;
  value: File | null;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>(
    {
      touched: false,
      error: '',
      value: null,
    },
  );

  const onDrop = async (files: File[]) => {

    setFormData(
      {
        touched: true,
        error: '',
        value: files[0],
      });
  };
  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        'text/html': ['.html'],
      },

      maxFiles: 1,
    });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='flex flex-col gap-[6px]'>
        <label htmlFor={'Html File'}>
          Scrape Html File
        </label>
        <div
          className='py-4 px-6 cursor-pointer min-h-fit rounded-lg border border-gray-200 bg-white'
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <>
              <div className='flex flex-col gap-3 w-full h-full items-center justify-center'>
                <div
                  className='flex p-3 justify-center items-center rounded-[28px] border-[6px] border-solid border-gray-50 bg-gray-100'
                >
                  <FiUploadCloud size={20} />
                </div>
                <div
                  className='flex flex-col gap-1 items-center'
                >
                  <p>Drop Html File Here</p>
                  <p>HTML only</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {formData.value === null ? (
                <div
                  className='flex flex-col gap-3 w-full h-full items-center justify-center'
                >
                  <div
                    className='flex p-3 justify-center items-center rounded-[28px] border-[6px] border-solid border-gray-50 bg-gray-100'
                  >
                    <FiUploadCloud size={20} />
                  </div>
                  <div
                    className='flex flex-col gap-1 items-center'
                  >
                    <p>
                      <span>
                        Click to upload{' '}
                      </span>
                      or drag and drop
                    </p>
                    <p>SVG, PNG, JPG</p>
                  </div>
                </div>
              ) : (
                <div
                  className='flex flex-col gap-3 w-full h-full items-center justify-center'
                >
                  <div
                    className='flex p-3 justify-center items-center rounded-[28px] border-[6px] border-solid border-gray-50 bg-gray-100'
                  >
                    <FiUploadCloud size={20} />
                  </div>
                  <div
                    className='flex flex-col gap-1 items-center'
                  >
                    <p>{formData.value.name}</p>
                    <p>{formData.value.size} bytes</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {fileRejections.map(({ file, errors }) => {
          return (
            <>
              {errors.map((e) => (
                <div
                  className='text-red-500 mx-1 text-xs font-normal leading-4'
                  key={e.code}
                >
                  {e.message}
                </div>
              ))}
            </>
          );
        })}
      </div>
    </main>
  );
}
