export default function ErrorHandle(error){
    return (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-300">
        <p className="text-sm">{error}</p>
        </div>
    );
}