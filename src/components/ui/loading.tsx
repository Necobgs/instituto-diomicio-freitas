export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-white dark:bg-black/40 fixed top-0 left-0 z-50">
      <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
