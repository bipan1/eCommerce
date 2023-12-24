import React from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

export default function MyEditor() {
    const [value, setValue] = React.useState('');

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'indent',
        'color',
        'background',
        'align',
        'link',
        'image',
    ];

    return (
        <ReactQuill
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            theme="snow"
        />
    );
}