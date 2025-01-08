"use client"
import { WatchRender } from '@/components/design/watch-render'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InputControl } from '@/components/ui_control/input'
import React, { useState } from 'react'
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { AnimatePresence } from "motion/react"
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { subformSchema, SubFormValue } from './subform.model'
import { Alert } from '@/components/ui/alert'

function AddressSection() {
  const { control, formState: { errors }, getFieldState, clearErrors } = useFormContext<SubFormValue>();
  const { fields, append, remove } = useFieldArray({ control, name: "address", keyName: 'idx' })
  return (
    <>
      {Boolean(errors.address?.root?.message || errors.address?.message) && (
        <Alert variant='destructive' className='text-sm my-2 text-center'>
          {'กรุณาระบุที่อยู่อย่างน้อย 1 สถานที่'}
        </Alert>
      )}
      <div className='space-y-2'>
        {fields.map((f, i) => (
          <div key={f.idx} className='grid grid-cols-3 gap-2 border-b-2 pb-4'>
            <div className='flex col-span-3 '>
              <div className='flex w-full md:basis-1/4'>
                <InputControl
                  control={control}
                  name={`address.${i}.type`}
                  placeholder='ประเภทที่อยู่'
                  label={
                    <div className='gap-2 flex items-center'>
                      <Trash2 onClick={(e) => {
                        e.stopPropagation();
                        remove(i);
                      }} />
                      <Badge variant='default'>{i + 1}</Badge>
                      <p>ประเภทที่อยู่</p>
                    </div>
                  }
                />
              </div>
            </div>
            <InputControl
              control={control}
              name={`address.${i}.name`}
              placeholder='ที่อยู่'
              label='ที่อยู่'
            />
            <InputControl
              control={control}
              name={`address.${i}.moo`}
              label='หมู่'
            />
            <InputControl
              control={control}
              name={`address.${i}.district`}
              label='district'
            />
            <InputControl
              control={control}
              name={`address.${i}.sub_district`}
              label='ตำบล'
            />
          </div>
        ))}
        <Button type='button' className='w-full' onClick={() => {
          append({

          } as any)
          if (errors.address?.root?.message) {
            clearErrors('address.root' as any)
          }
        }}>Add more</Button>
      </div>
    </>
  )
}

function DetailSection() {
  const ctx = useFormContext();

  return (
    <>
      <InputControl
        control={ctx.control}
        name='name'
        placeholder='Name'
        label='Name'
      />
      <InputControl
        control={ctx.control}
        name='email'
        placeholder='email'
        label='email'
      />
    </>
  )
}


function Display() {
  const { control } = useFormContext<any>()
  const values = useWatch<{
    name?: string
    email?: string
    address: {
      type?: string
      name?: string
      moo?: string
      district?: string
      sub_district?: string
    }[]
  }>({ control })
  return (
    <>
      <p>Name {values.name || "-"}</p>
      <p>Email {values.email || "-"}</p>

      {values.address?.map((v) => {

        return (
          <>
            <p>
              {[
                `type ${v.type || "-"}`,
                `ที่อยู่ ${v.name || "-"}`,
                `หมู่ ${v.moo || "-"}`,
                `district ${v.district || "-"}`,
                `sub_district ${v.sub_district || "-"}`,
              ].join(", ")}
            </p>
          </>
        )
      })}
    </>
  )
}

function SubformInner() {
  const [tabs, setTabs] = useState("A")
  const { getFieldState, formState } = useFormContext<SubFormValue>()
  const { errors } = formState
  const addressError = Boolean(errors.address?.root?.message || errors.address?.message)
  const ftab = Boolean(errors.email?.message || errors.name?.message)
  return (
    <>
      <div className='flex flex-col md:flex-row gap-4 w-full flex-1'>
        <Card className='w-full basis-1/2'>
          <CardHeader></CardHeader>
          <CardContent>
            <Display />
          </CardContent>
        </Card>
        <Card className='w-full'>
          <CardHeader>
            <Button>Save</Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={tabs} onValueChange={setTabs} >
              <TabsList>
                <TabsTrigger value='A'>
                  ข้อมูลส่วนตัว {ftab ? <Badge variant='destructive' >1</Badge> : ""}
                </TabsTrigger>
                <TabsTrigger className='gap-2 flex' value='B'>
                  ข้อมูลที่อยู่ {addressError ? <Badge variant='destructive' >1</Badge> : ""}
                </TabsTrigger>
                <TabsTrigger value='C'>
                  CCCCCCCC
                </TabsTrigger>
                <TabsTrigger value='D'>
                  DDDDDDDD
                </TabsTrigger>
              </TabsList>
              {tabs === 'A' && <DetailSection />}
              {tabs === 'B' && <AddressSection />}
              {/* <TabsContent value='A' >
                <DetailSection />
              </TabsContent>
              <TabsContent value='B' >
                <AnimatePresence mode='wait'>
                  <AddressSection />
                </AnimatePresence>
              </TabsContent> */}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )

}


export default function Subform() {
  const form = useForm({
    defaultValues: {

    },
    resolver: zodResolver(subformSchema)
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((d) => {
        console.log(d)
        toast.success("success")
      }, (e) => {
        console.log("error", e)
        toast.success("Error")
      })}>
        <SubformInner />
      </form>
    </FormProvider>
  )
}
