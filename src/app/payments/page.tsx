'use client';

import { useState, useEffect } from 'react';
import { paymentService, Payment } from '@/lib/services/payment.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadPayments();
  }, [page]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.listPayments(page, limit);
      if (response.success && response.data) {
        setPayments(response.data.data);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'; // dark/success
      case 'pending': return 'secondary'; // gray
      case 'failed': return 'destructive'; // red
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>History of all payment records</CardDescription>
          </div>
          <Button onClick={loadPayments} variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Booking ID</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">No transactions found</td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono">{payment.paymentId}</td>
                      <td className="px-6 py-4">{payment.bookingId}</td>
                      <td className="px-6 py-4 font-medium">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </td>
                      <td className="px-6 py-4 uppercase text-xs">{payment.paymentMethod}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusColor(payment.status) as any}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {/* TODO: Add Refund handling */}
                        <Button variant="ghost" size="sm">Details</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page {page} of {Math.ceil(total / limit)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}