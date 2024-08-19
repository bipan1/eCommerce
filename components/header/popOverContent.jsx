import { useSelector } from 'react-redux';
import { MdKeyboardArrowRight } from "react-icons/md";
import { Popover } from 'antd';
import { useRouter } from "next/navigation";

export default function PopOverContent() {
    const router = useRouter();

    const categories = useSelector((state) => state.category);
    const { data } = categories

    const Final = ({ subcategories }) => (
        <div className="bg-white border border-gray-300 rounded-md shadow-lg hover:cursor-pointer">
            {subcategories.map(subCat => (
                <div onClick={() => router.push(`/products/subcategories/${subCat.id}`)} key={subCat.id} className="flex justify-between min-w-[200px] max-w-[300px] p-3 border-b border-gray-200 text-gray-800 hover:bg-green-600 hover:text-white">
                    <h3 className="font-semibold font-xl">{subCat.name}</h3>
                </div>
            ))}

        </div>
    )

    return <div className="bg-white border border-gray-300 rounded-md shadow-lg p-2 hover:cursor-pointer">
        {data?.map((category) => (
            <>
                <Popover content={() => <Final subcategories={category.subcategories} />} placement='rightBottom'>
                    <div onClick={() => router.push(`/products/categories/${category.id}`)} key={category.name} className="flex justify-between min-w-[200px] max-w-[300px] p-3 border-b border-gray-200 text-gray-800 hover:bg-green-600 hover:text-white">
                        <div>
                            <h3 className="font-semibold font-xl">{category.name}</h3>
                        </div>
                        <div>
                            <MdKeyboardArrowRight />
                        </div>
                    </div>
                </Popover>
            </>

        ))}
    </div>
}