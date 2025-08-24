import BookingClient from "./BookingClient";

export default function Page({ params }: { params: { id: string } }) {
    return <BookingClient bookingId={Number(params.id)} />;
}