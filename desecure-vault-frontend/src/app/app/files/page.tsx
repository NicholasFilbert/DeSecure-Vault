'use client'

import React from 'react'
import '@/styles/app/files.css'
import Section from '@/components/common/Section'
import Header from '@/components/common/Header'
import Datagrid from '@/components/Datagrid/Datagrid'
import { faDownload, faFile, faPencil, faPencilAlt, faPlus, faShare, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import PopupButton from '@/components/common/PopupButton'
import FileUploadButton from '@/components/files/UploadButton'

const Files = () => {
  // columns?: {
  //   key: string;
  //   label: string;
  //   sortable?: boolean;
  //   width?: string;
  //   hide?: 'mobile' | 'none';
  //   icon?: IconDefinition,
  // }[];
  // data?: any[];
  // onSort?: (column: string) => void;
  // onFilter?: () => void;
  // fetchData?: (page: number) => any[];
  // hasDetail?: false;
  // detailContent?: any[];
  // pageSize?: number;

  const columns: DataGridColumns[] = [
    { key: 'name', label: 'Name', icon: faFile, sortable: true },
    { key: 'artist', label: 'Artist', sortable: false, hide: 'mobile' },
    { key: 'year', label: 'Year', sortable: true, hide: 'mobile' },
  ]

  const data = [{ id: 1, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
  { id: 2, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 3, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  { id: 4, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
  { id: 5, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 6, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  { id: 7, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
  { id: 8, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 9, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 10, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  { id: 11, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
  { id: 12, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 13, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  { id: 14, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
  { id: 15, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 32, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
  { id: 26, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 27, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  { id: 28, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 29, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  { id: 30, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
  { id: 31, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
  ]

  const detailContent = [
    { label: 'Download', icon: faDownload, action: (id: string) => { console.log('View More: ' + id) } },
    { label: 'Rename', icon: faPencil, action: (id: string) => { console.log('View More: ' + id) } },
    { label: 'Share', icon: faShare, action: (id: string) => { console.log('View More: ' + id) } },
    { label: 'Delete', icon: faTrash, action: (id: string) => { console.log('View More: ' + id) } },
  ]

  const fetchData = async (page: number) => {
    console.log('called')
    setTimeout(() => {

    }, 2000);
    if (page === 1) {
      return data
    }
    else if (page === 2) {
      return [
        { id: 16, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
        { id: 17, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
        { id: 18, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 19, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
        { id: 20, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 21, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
        { id: 22, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
      ]
    } else if (page === 3) {
      return [
        { id: 23, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
        { id: 24, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
        { id: 25, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 33, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 34, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 35, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
      ]
    } else if (page === 4) {
      return [
        { id: 36, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
        { id: 37, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
        { id: 38, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 39, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 40, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
        { id: 41, name: 'Shining Star', artist: 'Earth, Wind, and Fire', year: '1975', onClick: () => { console.log('3') } },
      ]
    } else if (page === 5) {
      return [
        { id: 42, name: 'The Sliding Mr. Bones (Next Stop, Pottersville)', artist: 'Malcolm Lockyer', year: '1961', onClick: () => { console.log('1') } },
        { id: 43, name: 'Witchy Woman', artist: 'The Eagles', year: '1972', onClick: () => { console.log('2') } },
      ]

    }

    return []
  }

  const uploadFile = async (formData: any) => {
      console.log(formData)
  }

  const actionButton = (
    <FileUploadButton
      icon={faUpload}
      label="Upload Files"
      popupTitle="Upload New Files"
      onConfirm={uploadFile}
      confirmText="Upload"
      size='large'
    />
  );


  return (
    <>
      <Header title="My Files" />
      <Section title='Files' action={actionButton} className='h-[80vh]'>
        <Datagrid columns={columns} detailContent={detailContent} fetchData={fetchData} hasDetail={true} className='h-[calc(100%-40px)]' />
      </Section>
    </>
  )
}

export default Files
