'use client'

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { initPermissions, selectPermissionLoading, selectPermissions } from "@/store/features/permissionSlice";
import { iPermissionForm } from "@/types/permission";
import { iUserForm } from "@/types/user";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PermissionsByResource = Record<string, iPermissionForm[]>;

interface PermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: iUserForm;
  setFormData: React.Dispatch<React.SetStateAction<iUserForm>>;
}

export function PermissionModal({
  open,
  onOpenChange,
  formData,
  setFormData,
}: PermissionModalProps) {
  const dispatch = useAppDispatch();
  const allPermissions = useSelector(selectPermissions) ?? [];
  const loading = useSelector(selectPermissionLoading);

  useEffect(() => {
    if (!open) {
      return;
    }

    dispatch(initPermissions({ page: 1, limit: 500 }));
  }, [dispatch, open]);

  const permissionsByResource = allPermissions.reduce<PermissionsByResource>((groups, permission) => {
    const resourceName = permission.resource?.name || "Sem recurso";
    if (!groups[resourceName]) {
      groups[resourceName] = [];
    }
    groups[resourceName].push(permission);
    return groups;
  }, {});

  const handleToggle = (permissionId: number) => {
    setFormData((prev) => {
      const currentIds = prev.permissionsId ?? [];
      return {
        ...prev,
        permissionsId: currentIds.includes(permissionId)
          ? currentIds.filter((id) => id !== permissionId)
          : [...currentIds, permissionId],
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] h-[95vh] max-w-[90vw] w-[90vw] sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Selecionar permissões</DialogTitle>
          <DialogDescription>
            As permissões estão agrupadas pela página/recurso. Marque apenas as ações desejadas e clique em salvar na tela principal.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Carregando permissões...</div>
          ) : Object.keys(permissionsByResource).length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhuma permissão disponível.</div>
          ) : (
            <div className="grid gap-4">
              {Object.entries(permissionsByResource).map(([resourceName, permissions]) => (
                <div key={resourceName} className="rounded-3xl border border-border bg-background p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="font-semibold">{resourceName}</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {permissions.map((permission) => {
                      const permissionId = permission.id;
                      const actionName = permission.action?.name || "Sem ação";
                      if (typeof permissionId !== "number") {
                        return null;
                      }
                      const isSelected = (formData.permissionsId ?? []).includes(permissionId);
                      return (
                        <label
                          key={permissionId}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all",
                            isSelected ? "border-primary bg-primary/10" : "border-border bg-muted hover:bg-accent"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggle(permissionId)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{actionName}</div>
                            <div className="text-xs text-muted-foreground">{permission.resource?.name || "Sem recurso"}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Fechar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
