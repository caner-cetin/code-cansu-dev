import toast, { Toaster, ToastBar } from 'react-hot-toast';
import Image from 'next/image'
const CustomToast: React.FC = () => {
  return (
    <Toaster
      containerStyle={{
        background: 'transparent',
        boxShadow: 'none',
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => (
            <div
              className={`
                ${t.visible ? 'animate-enter' : 'animate-leave'}
                max-w-lg min-w-[200px] w-96 bg-[#211e20] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5
              `}
            >
              <div className="flex items-center p-1">
                <div className="flex-shrink-0">
                  <div className='object-contain'>
                    {t.type === 'error' && (
                      <Image
                        src="/toast_error.png"
                        alt={`error ${message}`}
                        height={64}
                        width={64}
                      />
                    )}
                    {t.type === 'success' && (
                      <Image
                        src="/toast_success.png"
                        alt={`success ${message}`}
                        height={64}
                        width={64}
                      />
                    )}
                    {t.type === 'loading' && (
                      <Image
                        src="/toast_loading.png"
                        alt={`loading ${message}`}
                        height={64}
                        width={64}
                      />
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-[#e9efec]">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  className="p-2 rounded-md text-sm font-medium text-[#e9efec] hover:bg-[#504945] focus:outline-none focus:ring-2 focus:ring-[#504945] transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

export default CustomToast;