
export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export type Pagination<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[]
}

export interface ApiResponse extends Pagination<any> {
  error?: any;
}

/* TIKCET */
export interface Ticket {
  ticket_id: string;
  title: string;
  description: string;
  status: string;
  client_phonenumber: number | TicketClientPhoneNumber | null;
  caller_email: string | TicketClientPhoneNumber | null;
  caller_phonenumber: string | null;
  email_id: string | null;
  priority: string;
  flag: string;
  cat: number | { id: number; title: string; };
  assigned_agent: { id: string; first_name: string; last_name: string; email: string, phone_number: string, profile_pic: string };
  escalation: null | EscalationForm;
  timestamp: string;
  last_updated: string | null;
}

export interface EscalationForm {
  id: number;
  escalated_at: Date;
  raised_by: number | { id: number; first_name: string; last_name: string; email: string; phone_number: string };
  reason: string;
}

export interface TicketClientPhoneNumber { first_name: string, last_name: string, id: number, phone_number: string }

export interface TicketComments {
  id: string;
  title: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  user: User;
  ticket: string;
  // title: string;
  body: string;
  timestamp: Date;
  last_updated: null | Date;
}

export interface User {
  first_name: string;
  last_name: string;
  phone_number: string | null;
}

export interface TicketStatuses {
  total_count: number;
  status_counts: StatusCounts;
}

export interface StatusCounts {
  Pending: number;
  Active: number;
  Resolved: number;
  Cancelled: number;
  Escalated: number;
}



/* INVOICE */
export interface Invoice {
  id: number;
  staff: InvoiceCustomer;
  customer: InvoiceCustomer;
  invoice_items: InvoiceItem[];
  invoice_number: string;
  status: string;
  total_price: string;
  discounts: string;
  shipping_costs: string;
  taxes: string;
  amount_due: string;
  payment_terms: string;
  additional_notes: string;
  timestamp: Date;
  updated: Date;
}

export interface InvoiceCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_pic: string | null;
}

export interface InvoiceItem {
  id: number;
  product: InvoiceItemProduct;
  quantity: number;
  discounts: number;
}

export interface InvoiceItemProduct {
  id: number;
  name: string;
  price: number;
}


export interface Category {
  id?: number,
  title: string,
  description: string,
}


/* KYC */

export interface Kyc {
  id: number;
  user_type: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  dob: string;
  id_type: string;
  id_number: string;
  country: string;
  location: string;
  id_front: string | null;
  id_back: string | null;
  profession: string;
  father_name: string;
  mother_name: string;
  witness_name: string;
  witness_relation: string;
  user_age: string;
  gender: string;
  marital_status: string;
  religion: string;
  medication: boolean;
  medication_type: string;
  childrens: number;
  boys: number;
  girls: number;
  banks: string;
  doc: string | null;
  date_joined: string;
  profile_pic: string | null
}

/* PRODUCT */
export interface Product {
  id: number;
  thumb: string;
  name: string;
  description: string;
  color: null;
  size: null;
  img: null | string;
  author: null | Author
  price: string;
  discount: string;
  is_pub: boolean;
  category: ProductCategory;
}

export interface ProductCategory {
  id: number;
  cover: string;
  title: string;
  timestamp: Date;
  updated: Date;
}


export interface ProductDefaultParams {
  id?: number | null;
  name: string;
  description: string;
  price: number | string;
}

export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: null;
  email: string;
  location: string;
}


export type ProductTableProp = {
  filteredItems: Product[],
  deleteProduct: (ProductId: number) => void,
  editProduct: (product: Product) => void
}

/* FAQ */
export interface Faq {
  id?: number;
  question: string;
  answer: string;
}

/* EMAIL */

export interface Email {
  "@odata.etag": string;
  id: string;
  type: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview: string;
  importance: string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: boolean;
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body: Body;
  sender: Sender;
  from: From;
  toRecipients: ToRecipient[];
  ccRecipients: any[];
  bccRecipients: any[];
  replyTo: any[];
  flag: Flag;
}

interface Flag {
  flagStatus: string;
}

export interface ToRecipient {
  emailAddress: {
    name: string;
    address: string;
  };
}


interface From {
  emailAddress: EmailAddress1;
}

interface EmailAddress1 {
  name: string;
  address: string;
}

interface Sender {
  emailAddress: EmailAddress;
}

interface EmailAddress {
  name: string;
  address: string;
}

interface Body {
  contentType: string;
  content: string;
}

export interface Folder {
  id: string,
  displayName: string,
  parentFolderId: string,
  childFolderCount: number,
  unreadItemCount: number,
  totalItemCount: number,
  isHidden: boolean
}

/* TASK */
export interface Task {
  id: number;
  title: string;
  asign_agent: AsignAgent;
  description: string;
  priority: string;
  status: string;
  created_at: Date;
}

export interface AsignAgent {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  profile_pic: string;
}


/* CHAT START */
export interface Chat {
  id: number;
  chat_name: string;
  chat_picture: null | string
  is_group_chat: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  group_admin: null | number
  chat_users: ChatUser[];
  letestMessage: LetestMessage;
  groupAdmin: null | GroupAdmin;
}

export interface ChatDetail {
  isError: boolean;
  selectedChat: Chat;
  messages: Message[];
}

export interface ChatUser {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: null;
  email: string;
  profile_pic: null;
}

export interface LetestMessage {
  id: number;
  content: string;
  created_at: Date;
}

export interface GroupAdmin {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: null | string;
  email: string;
  profile_pic: null | string;
}

export interface Message {
  id: number;
  content: string;
  chat: number;
  sender: number,
  image: null | string;
  video: null | string;
  created_at: Date;
}

export interface MessageNotification {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: null;
  isGroupChat: boolean;
  chatPicture: null | string;
  chatName: null | string;
  sender: MsgSender;
}

export interface MsgSender {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  phoneNo: string;
  role: number;
}

