import FilterBtns from "@/components/settings/notifications/FilterBtns"


type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function NotificationPage(props: { searchParams: SearchParams }) {

  const searchParams = await props.searchParams



  const filter = searchParams.filter || 'all'


  return (
    <div>
      <h1 className='max-md:hidden'>Recent Notifications</h1>
      <FilterBtns />
    </div>
  )
}
