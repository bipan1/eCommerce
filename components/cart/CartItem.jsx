import { Button } from "antd";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { removeItem, increaseQuantity, decreaseQuantity } from '@/redux/features/bag-slice';

export default function CartItem({ item }) {

    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(removeItem(item.productId))
    }

    return <li class="flex py-6">
        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img src={item.image} alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." class="h-full w-full object-cover object-center" />
        </div>

        <div class="ml-4 flex flex-1 flex-col">
            <div>
                <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                        <a href="#">{item.name}</a>
                    </h3>
                    <p class="ml-4">${item.price}</p>
                </div>
                <p class="mt-1 text-sm text-gray-500">Salmon</p>
            </div>
            <div class="flex flex-1 items-end justify-between text-sm">
                <div className="flex items-center">
                    <button onClick={() => dispatch(increaseQuantity(item.productId))} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">+</button>
                    <div className="w-10 text-center">{item.quantity}</div>
                    <button onClick={() => dispatch(decreaseQuantity(item.productId))} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">-</button>
                </div>

                <div class="flex">
                    <Button onClick={handleDelete} icon={<MdDelete size={25} color="#8B0000" />} type="button" class="font-medium text-indigo-600 hover:text-indigo-500" />
                </div>
            </div>
        </div>
    </li>

}