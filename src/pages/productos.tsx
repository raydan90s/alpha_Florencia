
import ResultsPage from "../components/Productos/resultPage";
import SortDropdown from "../components/Productos/SortDropdown";

export default function ProductosPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
                    <SortDropdown />
                </div>
                <ResultsPage />
            </div>
        </main>
    );
}
