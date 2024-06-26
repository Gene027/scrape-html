'use client'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';

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

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = async (files: File[]) => {
    setError(null)
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

  const onSubmit = async () => {
    if (!formData.value) {
      setError('No file selected.');
      return;
    }

    setIsLoading(true)
    setError(null)

    const uploadData = new FormData();
    uploadData.append('file', formData.value);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/scrape`, {
        method: 'POST',
        body: uploadData,
      })

      if (!response.ok) {
        const res = await response.json()
        setError(res.error ?? 'Failed to process the file. Please try again.')
      }

      const blob = new Blob([await response.arrayBuffer()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = "walmart-scraped-data.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

    } catch (error: Error | any) {
      console.error(error)
    } finally {
      setIsLoading(false)
      setFormData(
        {
          touched: false,
          error: '',
          value: null,
        }
      )
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <div className='flex flex-col gap-[16px] w-[500px] '>
        <label className='text-center font-medium' htmlFor={'Html File'}>
          Scrape Walmart HTML File
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

        {error && (
          <div className='text-red-500 mx-1 text-xs font-normal leading-4'>
            {error}
          </div>
        )}
        {
          formData.value && (
            <button onClick={onSubmit} disabled={isLoading || !formData.value} className='py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer disabled:bg-blue-900 disabled:cursor-not-allowed flex justify-center'>
              {isLoading ? (<div className='flex gap-1 justify-end items-center'>
                <span>Scraping please wait</span>
                <LuLoader2 size={25} className='animate-spin' />
              </div>) : 'Upload'}
            </button>
          )
        }

      </div>
    </main>
  );
}
