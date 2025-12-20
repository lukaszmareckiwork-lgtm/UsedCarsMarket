using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Dtos.Account
{
    public class NewUserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public SellerType SellerType { get; set; }
        public string Token { get; set; }
        public string Id { get; set; }
    }
}