
'use client'
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react"
import { startLoading, stopLoading } from "@/redux/features/globalLoading-slice";
import axios from "axios";

export default function Jobs() {
    const [jobs, setJobs] = useState([])
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getShops = async () => {
            dispatch(startLoading())
            try {
                const jobsRes = await axios.get('http://localhost:3000/api/post', { params: { category: 'JOBS' } })
                setJobs(jobsRes.data.posts)
                dispatch(stopLoading())
            } catch (err) {
                dispatch(stopLoading())
                console.log(err)
            }
        }
        getShops()
    }, [])

    console.log(jobs)

    return <div>
        Jobs page
    </div>
}
