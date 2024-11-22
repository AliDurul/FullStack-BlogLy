
import { createAppSlice } from "@/lib/createAppSlice";
import { getAllTickets } from "./ticketAPI";
import { ApiResponse, EscalationForm, Pagination, Ticket, TicketClientPhoneNumber, TicketComments } from "@/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface defaultTicketParams {
    title: string;
    description: string;
    client_phonenumber: TicketClientPhoneNumber | number | null
    caller_phonenumber: string | null;
    email_id: string | null;
    caller_email: string | TicketClientPhoneNumber | null;
    flag: string;
    cat: number;
    priority: string;
    status: string;
    ticket_id?: string
    timestamp?: string
    last_updated?: string
    escalation: null | EscalationForm
    assigned_agent: { id: string; first_name: string; last_name: string; };
}

export interface ticketSliceState {
    tickets: Pagination<Ticket>;
    ticket: Ticket | defaultTicketParams;
    status: "idle" | "loading" | "failed";
    error: null | string;
    ticketModal: boolean;
    isEscalation: boolean;
    ticketComments: TicketComments;
    escalation: null | EscalationForm
}


const initialState: ticketSliceState = {
    tickets: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    ticketModal: false,
    isEscalation: false,
    escalation: null,
    ticketComments: { id: "", title: "", comments: [] },
    ticket: {
        escalation: null,
        title: "",
        description: "",
        client_phonenumber: null,
        caller_phonenumber: null,
        caller_email: null,
        email_id: null,
        flag: "",
        cat: 0,
        priority: "",
        status: "",
        assigned_agent: { id: "", first_name: "", last_name: "" }
    },
};

export const ticketSlice = createAppSlice({
    name: 'ticket',
    initialState,
    reducers: (create) => ({
        updateTickets: create.reducer((state, action: PayloadAction<Ticket[]>) => {
            state.status = 'idle';
            state.tickets.results = action.payload;
        }),
        updateticketComments: create.reducer((state, action: PayloadAction<TicketComments>) => {
            state.status = 'idle';
            state.ticketComments = action.payload;
        }),
        setTicketModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.ticketModal = action.payload;
        }),
        setEscalate: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.isEscalation = action.payload;
        }),
        updateTicketState: create.reducer((state, action: PayloadAction<Ticket | defaultTicketParams>) => {
            state.status = 'idle';
            state.ticket = action.payload;
        }),
        fetchAllTicketAsync: create.asyncThunk(async (params: { page?: string, pageSize?: string }) => {
            const { page, pageSize } = params
            try {
                const response: ApiResponse = await getAllTickets(null, page, pageSize);
                if (response.error) {
                    throw new Error(response.error);
                }
                return response
            } catch (error) {
                throw new Error("Data fetch failed: " + (error as Error).message);
            }
        }, {
            pending: (state) => { state.status = "loading"; },
            fulfilled: (state, action) => { state.status = "idle"; state.tickets = action.payload; },
            rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
        },
        ),
    }),
    selectors: {
        selectTickets: (ticket) => ticket.tickets,
        selectTicketState: (ticket) => ticket,
        selectTicketModal: (ticket) => ticket.ticketModal,
        selectIsEscalation: (ticket) => ticket.isEscalation,
        selectTicket: (ticket) => ticket.ticket,
        selectTicketComments: (ticket) => ticket.ticketComments,
    }
});

export const { fetchAllTicketAsync, updateTickets, setTicketModal, updateTicketState, updateticketComments, setEscalate } = ticketSlice.actions;

export const { selectTickets, selectTicketState, selectTicketModal, selectTicket, selectTicketComments, selectIsEscalation } = ticketSlice.selectors
