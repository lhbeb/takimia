"use client";

import AdminLayout from '@/components/AdminLayout';

export default function MailProjectPage() {
    const mailProjectUrl = process.env.NEXT_PUBLIC_MAIL_PROJECT_URL;

    return (
        <AdminLayout title="Mail Project">
            {mailProjectUrl ? (
                <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8" style={{ height: 'calc(100vh - 120px)' }}>
                    <iframe
                        src={mailProjectUrl}
                        title="Mail Project"
                        className="w-full h-full border-0"
                        allow="clipboard-read; clipboard-write"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                    />
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
                    The mail project URL is not configured for this environment.
                </div>
            )}
        </AdminLayout>
    );
}
