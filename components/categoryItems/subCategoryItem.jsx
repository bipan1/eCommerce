import { MdDeleteOutline } from "react-icons/md";

export default function SubCategoryItem({ subcat, handleDeleteSubcategory }) {
    return (
        <div key={subcat.id} className="flex justify-between border-t border-gray-300 font-medium p-2 ml-6 mt-4">

            <div className="flex-1">
                <p >{subcat.name}</p>
            </div>
            <div onClick={() => handleDeleteSubcategory(subcat.id)} className="flex items-center ml-3 hover:cursor-pointer">
                <MdDeleteOutline size={20} color="red" />
            </div>
        </div>
    )
}