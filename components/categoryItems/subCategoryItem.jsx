import { RiDeleteBin5Line } from "react-icons/ri";

export default function SubCategoryItem({ subcat, handleDeleteSubcategory }) {
    return (
        <div key={subcat.id} className="flex justify-between font-medium bg-white rounded-md shadow-md p-2 ml-6 mt-4">

            <div className="flex-1">
                <p >{subcat.name}</p>
            </div>
            <div onClick={() => handleDeleteSubcategory(subcat.id)} className="flex items-center ml-3 hover:cursor-pointer">
                <RiDeleteBin5Line />
            </div>
        </div>
    )
}