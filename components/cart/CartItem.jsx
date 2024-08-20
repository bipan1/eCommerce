import { Button } from "antd";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { removeItem, increaseQuantity, decreaseQuantity } from '@/redux/features/bag-slice';

export default function CartItem({ item }) {

    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(removeItem(item.productId))
    }

    return <li className="flex py-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img src={item.image} alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." className="h-full w-full object-cover object-center" />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
            <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                        <a href="#">{item.name}</a>
                    </h3>
                    <p className="ml-4">${item.price}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Salmon</p>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
                <div className="flex items-center">
                    <button onClick={() => dispatch(increaseQuantity(item.productId))} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">+</button>
                    <div className="w-10 text-center">{item.quantity}</div>
                    <button onClick={() => dispatch(decreaseQuantity(item.productId))} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">-</button>
                </div>

                <div className="flex">
                    <Button onClick={handleDelete} icon={<MdDelete size={25} color="#8B0000" />} type="button" className="font-medium text-indigo-600 hover:text-indigo-500" />
                </div>
            </div>
        </div>
    </li>

}