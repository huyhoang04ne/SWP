namespace GHMS.Common.Req
{
    public class RefundReq
    {
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
} 