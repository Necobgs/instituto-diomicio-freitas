"use client";

import CardReferral from "@/components/page/referral-page/CardReferral";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { initReferrals, selectReferralError, selectReferralLoading, selectReferrals, selectReferralCount, selectReferralHasPreviousPage, selectReferralHasNextPage } from "@/store/features/referralSlice";
import MaskedInput from "@/components/ui/masked-input";
import { defaultFilterReferral } from "@/types/referral";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudentForm } from "@/types/student";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { iEnterpriseForm } from "@/types/enterprise";
import { JobCombobox } from "@/components/ui/combo-box-job";
import { iJobForm } from "@/types/job";

export default function ReferralPage() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const referrals = useSelector(selectReferrals);
    const countItems = useSelector(selectReferralCount);
    const loading = useSelector(selectReferralLoading);
    const error = useSelector(selectReferralError);
    const hasNextPage = useSelector(selectReferralHasNextPage);
    const hasPreviousPage = useSelector(selectReferralHasPreviousPage);

    const [formData, setFormData] = useState(defaultFilterReferral);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMaskedInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSearch = () => {
        if (currentPage === 1)  {
            dispatch(initReferrals({...formData, page: currentPage, limit: itemsPerPage }));
        }
        else {
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        dispatch(initReferrals({...formData, page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);

    return (
        <>
            {loading
                ? <Loading />
                : <div className="w-full h-full p-4 flex flex-col">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Buscar encaminhamentos</h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <div>
                                <StudentCombobox
                                    student={formData.student}
                                    setStudent={(student: iStudentForm | undefined) =>
                                        setFormData((prev) => ({ ...prev, student }))
                                    }
                                />
                            </div>
                            <div>
                                <EnterpriseCombobox
                                    enterprise={formData.enterprise}
                                    setEnterprise={(enterprise: iEnterpriseForm | undefined) =>
                                        setFormData((prev) => ({ ...prev, enterprise }))
                                    }
                                />
                            </div>
                            <div>
                                <JobCombobox
                                    job={formData.job}
                                    setJob={(job: iJobForm | undefined) =>
                                        setFormData((prev) => ({ ...prev, job }))
                                    }
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input 
                                    id="admissionDateIni"
                                    name="admissionDateIni"
                                    value={formData?.admissionDateIni}
                                    onChange={handleInputChange}
                                    placeholder="Data da admissão início" 
                                    type="date" 
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input
                                    id="admissionDateEnd"
                                    name="admissionDateEnd"
                                    value={formData?.admissionDateEnd}
                                    onChange={handleInputChange}
                                    placeholder="Data da admissão fim"
                                    type="date" 
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input 
                                    id="terminationDateIeedfIni"
                                    name="terminationDateIeedfIni"
                                    value={formData?.terminationDateIeedfIni}
                                    onChange={handleInputChange}
                                    placeholder="Provável data desligamento IEEDF início" 
                                    type="date" 
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input
                                    id="terminationDateIeedfEnd"
                                    name="terminationDateIeedfEnd"
                                    value={formData?.terminationDateIeedfEnd}
                                    onChange={handleInputChange}
                                    placeholder="Provável data desligamento IEEDF fim"
                                    type="date" 
                                />
                            </div>
                            <div>
                                <Combobox
                                    items={[{ value: "all", label: "Ambos"}, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                                    value={formData?.enabled}
                                    setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
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
                        <div>
                            {error ? error : `Quantidade de encaminhamentos encontradas: ${countItems}`}
                        </div>

                        <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
                            {
                                referrals?.[0] &&
                                referrals?.map(referral =>
                                    <CardReferral {...referral} key={referral.id} />
                                )
                            }
                        </div>
                    </section>

                    <PaginationComponent
                        cbNext={() => hasNextPage && setCurrentPage(prev => prev + 1)}
                        cbPrevius={() => hasPreviousPage && setCurrentPage(prev => prev - 1)}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        pageActivated={currentPage}
                    />

                    <button
                        className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer"
                        onClick={() => router.push('/student/referral/create')}
                    >+</button>
                </div>
            }
        </>
    );
}
