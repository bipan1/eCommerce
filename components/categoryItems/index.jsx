import { toast } from 'react-toastify'
import { FaEdit, FaEllipsisH, FaPlus } from "react-icons/fa"
import { Button, Dropdown, Input } from "antd"
import { RiDeleteBin5Line } from "react-icons/ri";
import SubCategoryItem from "./subCategoryItem";
import { useState } from "react";
import { addSubcategory, removeSubcategory } from '@/redux/features/category-slice';
import { useDispatch } from 'react-redux';
import { axiosApiCall } from 'utils/axiosApiCall';

export default function CategoryItems({ item, handleCategoryEdit, handleCategoryDelete }) {


    const [openSub, setOpenSub] = useState(false);
    const [name, setName] = useState('');
    const deleteSuccess = () => toast.success('Sub Category deleted sucessfully')
    const createSuccess = () => toast.success('Sub Category created sucessfully')


    const dispatch = useDispatch();
    const addNewSubCategory = async () => {
        try {
            const response = await axiosApiCall('/subcategory', 'POST', { name, categoryId: item.id });
            setName('');
            const createdSubCategory = response.data.category
            dispatch(addSubcategory(createdSubCategory))
            createSuccess();
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteSubcategory = async (subCatId) => {

        try {
            await axiosApiCall('/subcategory', 'DELETE', { data: { id: subCatId } })
            const data = { categoryId: item.id, subcategoryId: subCatId }
            dispatch(removeSubcategory(data))
            deleteSuccess();
        } catch (err) {
            console.log(err)
        }
    }

    const items = [
        {
            id: '1',
            label: (
                <lable onClick={() => handleCategoryEdit(item)}>Edit</lable>
            ),
            icon: <FaEdit />
        },
        {
            id: '2',
            label: (
                <lable onClick={() => handleCategoryDelete(item.id)}> Delete</ lable>
            ),
            icon: <RiDeleteBin5Line />
        }
    ]

    return (
        <div className="w-1/2">
            <div onClick={() => setOpenSub(!openSub)} className="bg-white shadow-md hover:shadow-lg hover:cursor-pointer rounded-lg mt-5 flex justify-between p-3" key={item.id}>
                <div className="flex-1">
                    <p className="font-bold text-lg">{item.name}</p>
                </div>
                <div className="flex items-center">
                    <Dropdown
                        menu={{
                            items,
                        }}
                        placement="bottomLeft"
                    >
                        <FaEllipsisH className="mr-4" />
                    </Dropdown>
                </div>
            </div>

            {openSub && <div className="flex mt-2 ml-6">
                <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Add new Sub Category" />
                <Button onClick={addNewSubCategory} className='ml-4 float-right bg-blue-400' type='primary'><FaPlus className='inline' /><span className='ml-4'>Add</span></Button>
            </div>}
            {openSub && item?.subcategories?.length > 0 && item?.subcategories.map(subcat => {
                return <div>
                    <SubCategoryItem handleDeleteSubcategory={handleDeleteSubcategory} subcat={subcat} />
                </div>
            })}
        </div>
    )
}
