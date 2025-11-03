"use client";

import CardNotification from "@/components/page/notification-page/CardNotification";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import Loading from "@/components/ui/loading";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { editNotification, initNotifications, selectNotificationError, selectNotificationLoading, selectNotifications, selectNotificationTotal, verifyHasUnreadNotifications } from "@/store/features/notificationSlice";
import { iNotification } from "@/types/notification";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";

export default function NotificationPage() {

    const dispatch = useAppDispatch();
    const notifications = useSelector(selectNotifications);
    const totalItems = useSelector(selectNotificationTotal);
    const loading = useSelector(selectNotificationLoading);
    const error = useSelector(selectNotificationError);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);

    const defaultData: {read: string} = {
        read: "false"
    };
    const [formData, setFormData] = useState(defaultData);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleSearch = () => {
        if (currentPage === 1)  {
            dispatch(initNotifications({...formData, page: currentPage, limit: itemsPerPage, read: formData.read}));
        }
        else {
            setCurrentPage(1);
        }
    }

    const readNotification = async(n: iNotification) => {

        try {
            await dispatch(editNotification({...n, read: true})).unwrap();
            await dispatch(verifyHasUnreadNotifications());
            dispatch(initNotifications({...formData, page: currentPage, limit: itemsPerPage }));
        } catch (error: any) {
            handleAlert("Erro",error?.message || 'Erro ao colocar notificação como lida');
        }
    };

    const handleAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertDesc(message)
        setInfoAlertOpen(true);
    }

    useEffect(() => {
        dispatch(initNotifications({...formData, page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);

    const hasNextPage = currentPage * itemsPerPage < totalItems;
    const hasPreviousPage = currentPage > 1;

    return (
        <>
            {loading
                ? <Loading />
                : <div className="w-full h-full p-4 flex flex-col">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Notificações</h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <div>
                                <Combobox
                                    items={[{ value: "true", label: "Lidas" }, { value: "false", label: "Não Lidas" }]}
                                    value={formData?.read}
                                    setValue={(value) => setFormData(prev => ({ ...prev, read: value }))}
                                    placeholder="Selecione a situação..."
                                    searchPlaceholder="Buscar situação..."
                                    notFoundMessage="Nenhuma situação encontrada"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Button className="w-full" onClick={handleSearch}>Buscar</Button>
                            </div>
                        </div>
                    </section>

                    <Separator className="mt-6" />

                    <section className="mt-4 flex-auto">
                        {notifications.length > 0 || error
                            ? <div>
                                {error ? error : `Quantidade de notificações encontradas: ${totalItems}`}
                            </div>
                            : ""
                        }

                        <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(1fr,1fr))] mb-5">
                            {notifications.map(notification =>
                                <CardNotification 
                                    key={notification.id} 
                                    notification={notification}
                                    readNotification={(n) => readNotification(n)}
                                />
                            )}
                        </div>
                    </section>

                    <PaginationComponent
                        cbNext={() => hasNextPage && setCurrentPage(prev => prev + 1)}
                        cbPrevius={() => hasPreviousPage && setCurrentPage(prev => prev - 1)}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        pageActivated={currentPage}
                    />

                    <InfoAlertDialog
                        message={alertDesc} 
                        title={alertTitle} 
                        open={infoAlertOpen} 
                        onOpenChange={setInfoAlertOpen}
                    />
                </div>
            }
        </>
    );
}
