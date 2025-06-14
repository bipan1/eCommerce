import { useSelector } from 'react-redux';
import { MdKeyboardArrowRight } from "react-icons/md";
import { Popover } from 'antd';
import { useRouter } from "next/navigation";
import { FaShoppingBag, FaTshirt, FaMobileAlt, FaLaptop, FaHome, FaUtensils, FaBook, FaGamepad, FaHeartbeat, FaCar } from "react-icons/fa";
import { GiJewelCrown, GiLipstick, GiRunningShoe, GiSunglasses, GiWatch } from "react-icons/gi";
import { MdSportsSoccer, MdToys, MdPets } from "react-icons/md";
import { BsLightningCharge, BsStar, BsClock } from "react-icons/bs";

export default function PopOverContent() {
    const router = useRouter();
    const categories = useSelector((state) => state.category);
    const { data } = categories;

    // Category icons mapping with updated colors
    const categoryIcons = {
        'Fashion': <FaTshirt className="text-2xl" />,
        'Electronics': <FaMobileAlt className="text-2xl" />,
        'Computers': <FaLaptop className="text-2xl" />,
        'Home & Living': <FaHome className="text-2xl" />,
        'Beauty': <GiLipstick className="text-2xl" />,
        'Sports': <MdSportsSoccer className="text-2xl" />,
        'Books': <FaBook className="text-2xl" />,
        'Toys': <MdToys className="text-2xl" />,
        'Health': <FaHeartbeat className="text-2xl" />,
        'Automotive': <FaCar className="text-2xl" />,
        'Jewelry': <GiJewelCrown className="text-2xl" />,
        'Shoes': <GiRunningShoe className="text-2xl" />,
        'Accessories': <GiSunglasses className="text-2xl" />,
        'Watches': <GiWatch className="text-2xl" />,
        'Gaming': <FaGamepad className="text-2xl" />,
        'Pet Supplies': <MdPets className="text-2xl" />,
        'Groceries': <FaUtensils className="text-2xl" />,
        'default': <FaShoppingBag className="text-2xl" />
    };

    const SubCategories = ({ subcategories, categoryName }) => (
        <div className="bg-white rounded-xl shadow-2xl min-w-[700px] max-w-[900px] overflow-hidden">
            <div className="p-10">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-14 h-14 flex items-center justify-center text-[#2C7A7B] bg-[#E6FFFA] rounded-xl">
                        {categoryIcons[categoryName] || categoryIcons.default}
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-[#2D3748]">{categoryName}</h3>
                        <p className="text-[#718096] mt-1">Discover our curated collection of {categoryName.toLowerCase()}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                    {subcategories.map(subCat => (
                        <div 
                            key={subCat.id}
                            onClick={() => router.push(`/products/subcategories/${subCat.id}`)}
                            className="group flex items-center gap-4 py-2.5 cursor-pointer"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#FC8181] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <span className="text-[#4A5568] text-lg group-hover:text-[#FC8181] transition-colors duration-300">
                                {subCat.name}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-[#E2E8F0]">
                    <button 
                        onClick={() => router.push(`/products/categories/${data.find(cat => cat.name === categoryName)?.id}`)}
                        className="text-[#2C7A7B] hover:text-[#FC8181] font-medium transition-colors duration-300 flex items-center gap-3 group text-lg"
                    >
                        <span>Explore all {categoryName}</span>
                        <MdKeyboardArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-2xl min-w-[900px] max-w-[1100px] overflow-hidden">
            <div className="p-10">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[#2D3748]">Explore Categories</h2>
                    <p className="text-[#718096] mt-2 text-lg">Find everything you need in our diverse collection</p>
                </div>

                <div className="grid grid-cols-4 gap-x-16 gap-y-8">
                    {data?.map((category) => (
                        <Popover 
                            key={category.id}
                            content={() => <SubCategories subcategories={category.subcategories} categoryName={category.name} />}
                            placement='rightTop'
                            trigger="hover"
                            overlayClassName="category-popover"
                        >
                            <div 
                                onClick={() => router.push(`/products/categories/${category.id}`)}
                                className="group cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 flex items-center justify-center text-[#2C7A7B] bg-[#E6FFFA] rounded-xl group-hover:scale-110 transition-all duration-300">
                                        {categoryIcons[category.name] || categoryIcons.default}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[#2D3748] text-lg group-hover:text-[#FC8181] transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                        <p className="text-[#718096] mt-1">
                                            {category.subcategories?.length || 0} collections
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Popover>
                    ))}
                </div>

                <div className="mt-16 pt-10 border-t border-[#E2E8F0]">
                    <div className="grid grid-cols-2 gap-16">
                        <div>
                            <h3 className="font-semibold text-[#2D3748] text-xl mb-6 flex items-center gap-3">
                                <BsLightningCharge className="text-[#FC8181]" />
                                Quick Access
                            </h3>
                            <div className="space-y-4">
                                <button 
                                    onClick={() => router.push('/deals')}
                                    className="flex items-center gap-4 py-3 text-[#4A5568] hover:text-[#FC8181] transition-colors duration-300 group text-lg"
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#FC8181] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    <span>Flash Deals</span>
                                </button>
                                <button 
                                    onClick={() => router.push('/new-arrivals')}
                                    className="flex items-center gap-4 py-3 text-[#4A5568] hover:text-[#FC8181] transition-colors duration-300 group text-lg"
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#FC8181] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    <span>New Arrivals</span>
                                </button>
                                <button 
                                    onClick={() => router.push('/best-sellers')}
                                    className="flex items-center gap-4 py-3 text-[#4A5568] hover:text-[#FC8181] transition-colors duration-300 group text-lg"
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#FC8181] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    <span>Best Sellers</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#2D3748] text-xl mb-6 flex items-center gap-3">
                                <BsStar className="text-[#2C7A7B]" />
                                Popular Categories
                            </h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                {data?.slice(0, 4).map((category) => (
                                    <div 
                                        key={category.id}
                                        onClick={() => router.push(`/products/categories/${category.id}`)}
                                        className="flex items-center gap-4 py-3 text-[#4A5568] hover:text-[#FC8181] transition-colors duration-300 cursor-pointer group text-lg"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-[#FC8181] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                        <span>{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}