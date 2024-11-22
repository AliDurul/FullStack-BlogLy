

import {
  HorizontalDropRotateIcon,
  HorizontalComponentIcon,
  HorizontalElementsIcon,
  HorizontalTablesıcon,
  HorizontalFormsIcon,
  HorizontalPagesIcon,
  HorizontalMoreIcon,
  HorizontalAppsIcon,
  HorizontalDropIcon,
  HorizontalDashboardIcon
} from '@/app/icons';
import Link from 'next/link';

const HorizontalBar = () => {
  return (
    <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white py-1.5 px-6 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalDashboardIcon />
            <span className="px-1">dashboard</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/">sales</Link>
          </li>
          <li>
            <Link href="/analytics">analytics</Link>
          </li>
          <li>
            <Link href="/finance">finance</Link>
          </li>
          <li>
            <Link href="/crypto">crypto</Link>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalAppsIcon />
            <span className="px-1">apps</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/apps/chat">chat</Link>
          </li>
          <li>
            <Link href="/apps/mailbox">mailbox</Link>
          </li>
          <li>
            <Link href="/apps/todolist">todo_list</Link>
          </li>
          <li>
            <Link href="/apps/notes">notes</Link>
          </li>
          <li>
            <Link href="/apps/scrumboard">scrumboard</Link>
          </li>
          <li>
            <Link href="/apps/contacts">contacts</Link>
          </li>
          <li className="relative">
            <button type="button">
              invoice
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/apps/invoice/list">list</Link>
              </li>
              <li>
                <Link href="/apps/invoice/preview">preview</Link>
              </li>
              <li>
                <Link href="/apps/invoice/action">add</Link>
              </li>
              <li>
                <Link href="/apps/invoice/edit">edit</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/apps/calendar">calendar</Link>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalComponentIcon />
            <span className="px-1">components</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/components/tabs">tabs</Link>
          </li>
          <li>
            <Link href="/components/accordions">accordions</Link>
          </li>
          <li>
            <Link href="/components/modals">modals</Link>
          </li>
          <li>
            <Link href="/components/cards">cards</Link>
          </li>
          <li>
            <Link href="/components/carousel">carousel</Link>
          </li>
          <li>
            <Link href="/components/countdown">countdown</Link>
          </li>
          <li>
            <Link href="/components/counter">counter</Link>
          </li>
          <li>
            <Link href="/components/sweetalert">sweet_alerts</Link>
          </li>
          <li>
            <Link href="/components/timeline">timeline</Link>
          </li>
          <li>
            <Link href="/components/notifications">notifications</Link>
          </li>
          <li>
            <Link href="/components/media-object">media_object</Link>
          </li>
          <li>
            <Link href="/components/list-group">list_group</Link>
          </li>
          <li>
            <Link href="/components/pricing-table">pricing_tables</Link>
          </li>
          <li>
            <Link href="/components/lightbox">lightbox</Link>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalElementsIcon />
            <span className="px-1">elements</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/elements/alerts">alerts</Link>
          </li>
          <li>
            <Link href="/elements/avatar">avatar</Link>
          </li>
          <li>
            <Link href="/elements/badges">badges</Link>
          </li>
          <li>
            <Link href="/elements/breadcrumbs">breadcrumbs</Link>
          </li>
          <li>
            <Link href="/elements/buttons">buttons</Link>
          </li>
          <li>
            <Link href="/elements/buttons-group">button_groups</Link>
          </li>
          <li>
            <Link href="/elements/color-library">color_library</Link>
          </li>
          <li>
            <Link href="/elements/dropdown">dropdown</Link>
          </li>
          <li>
            <Link href="/elements/infobox">infobox</Link>
          </li>
          <li>
            <Link href="/elements/jumbotron">jumbotron</Link>
          </li>
          <li>
            <Link href="/elements/loader">loader</Link>
          </li>
          <li>
            <Link href="/elements/pagination">pagination</Link>
          </li>
          <li>
            <Link href="/elements/popovers">popovers</Link>
          </li>
          <li>
            <Link href="/elements/progress-bar">progress_bar</Link>
          </li>
          <li>
            <Link href="/elements/search">search</Link>
          </li>
          <li>
            <Link href="/elements/tooltips">tooltips</Link>
          </li>
          <li>
            <Link href="/elements/treeview">treeview</Link>
          </li>
          <li>
            <Link href="/elements/typography">typography</Link>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalTablesıcon />
            <span className="px-1">tables</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/tables">tables</Link>
          </li>
          <li className="relative">
            <button type="button">
              datatables
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/datatables/basic">basic</Link>
              </li>
              <li>
                <Link href="/datatables/advanced">advanced</Link>
              </li>
              <li>
                <Link href="/datatables/skin">skin</Link>
              </li>
              <li>
                <Link href="/datatables/order-sorting">order_sorting</Link>
              </li>
              <li>
                <Link href="/datatables/multi-column">multi_column</Link>
              </li>
              <li>
                <Link href="/datatables/multiple-tables">multiple_tables</Link>
              </li>
              <li>
                <Link href="/datatables/alt-pagination">alt_pagination</Link>
              </li>
              <li>
                <Link href="/datatables/checkbox">checkbox</Link>
              </li>
              <li>
                <Link href="/datatables/range-search">range_search</Link>
              </li>
              <li>
                <Link href="/datatables/export">export</Link>
              </li>
              <li>
                <Link href="/datatables/column-chooser">column_chooser</Link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalFormsIcon />
            <span className="px-1">forms</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/forms/basic">basic</Link>
          </li>
          <li>
            <Link href="/forms/input-group">input_group</Link>
          </li>
          <li>
            <Link href="/forms/layouts">layouts</Link>
          </li>
          <li>
            <Link href="/forms/validation">validation</Link>
          </li>
          <li>
            <Link href="/forms/input-mask">input_mask</Link>
          </li>
          <li>
            <Link href="/forms/select2">select2</Link>
          </li>
          <li>
            <Link href="/forms/touchspin">touchspin</Link>
          </li>
          <li>
            <Link href="/forms/checkbox-radio">checkbox_adio</Link>
          </li>
          <li>
            <Link href="/forms/switches">switches</Link>
          </li>
          <li>
            <Link href="/forms/wizards">wizards</Link>
          </li>
          <li>
            <Link href="/forms/file-upload">file_upload</Link>
          </li>
          <li>
            <Link href="/forms/quill-editor">quill_editor</Link>
          </li>
          <li>
            <Link href="/forms/markdown-editor">markdown_editor</Link>
          </li>
          <li>
            <Link href="/forms/date-picker">date_ange_picker</Link>
          </li>
          <li>
            <Link href="/forms/clipboard">clipboard</Link>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalPagesIcon />
            <span className="px-1">pages</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li className="relative">
            <button type="button">
              users
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/users/profile">profile</Link>
              </li>
              <li>
                <Link href="/users/user-account-settings">account_settings</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/pages/knowledge-base">knowledge_base</Link>
          </li>
          <li>
            <Link href="/pages/contact-us" target="_blank">
              contact_form
            </Link>
          </li>
          <li>
            <Link href="/pages/faq">faq</Link>
          </li>
          <li>
            <Link href="/pages/coming-soon" target="_blank">
              coming_soon
            </Link>
          </li>
          <li>
            <Link href="/pages/maintenence" target="_blank">
              maintenence
            </Link>
          </li>
          <li className="relative">
            <button type="button">
              error
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/pages/error404" target="_blank">
                  404
                </Link>
              </li>
              <li>
                <Link href="/pages/error500" target="_blank">
                  500
                </Link>
              </li>
              <li>
                <Link href="/pages/error503" target="_blank">
                  503
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative">
            <button type="button">
              login
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/auth/cover-login" target="_blank">
                  login_cover
                </Link>
              </li>
              <li>
                <Link href="/auth/boxed-signin" target="_blank">
                  login_boxed
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative">
            <button type="button">
              register
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/auth/cover-register" target="_blank">
                  register_cover
                </Link>
              </li>
              <li>
                <Link href="/auth/boxed-signup" target="_blank">
                  register_boxed
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative">
            <button type="button">
              password_recovery
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/auth/cover-password-reset" target="_blank">
                  recover_id_cover
                </Link>
              </li>
              <li>
                <Link href="/auth/boxed-password-reset" target="_blank">
                  recover_id_boxed
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative">
            <button type="button">
              lockscreen
              <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                <HorizontalDropIcon />
              </div>
            </button>
            <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
              <li>
                <Link href="/auth/cover-lockscreen" target="_blank">
                  unlock_cover
                </Link>
              </li>
              <li>
                <Link href="/auth/boxed-lockscreen" target="_blank">
                  unlock_boxed
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li className="menu nav-item relative">
        <button type="button" className="nav-link">
          <div className="flex items-center">
            <HorizontalMoreIcon />
            <span className="px-1">more</span>
          </div>
          <div className="right_arrow">
            <HorizontalDropRotateIcon />
          </div>
        </button>
        <ul className="sub-menu">
          <li>
            <Link href="/dragndrop">drag_and_drop</Link>
          </li>
          <li>
            <Link href="/charts">charts</Link>
          </li>
          <li>
            <Link href="/font-icons">font_icons</Link>
          </li>
          <li>
            <Link href="/widgets">widgets</Link>
          </li>
          <li>
            <button type="button">documentation</button>
          </li>
        </ul>
      </li>
    </ul>
  )
}

export default HorizontalBar