using FBIArchive.Attributes;
using FBIArchive.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FBIArchive.Data;

namespace FBIArchive.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AuthorizeAdmin]
    public class AdminController : ControllerBase
    {
        private readonly FBIArchiveContext _context;

        public AdminController(FBIArchiveContext context)
        {
            _context = context;
        }

        [HttpPut("document/{id}")]
        public async Task<IActionResult> UpdateDocument(int id, [FromBody] UpdateDocumentDto dto)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
                return NotFound(new { message = "Document not found" });

            var validSecurityLevels = new List<string>
            {
                "Совершенно секретно", "Секретно", "Конфиденциально",
                "Для служебного пользования", "Открытый"
            };

          
            var validDocumentTypes = new List<string>
            {
                "Служебная записка", "Отчет о наблюдении", "Протокол допроса",
                "Телеграмма", "Агентурное донесение"
            };

           
            if (!string.IsNullOrEmpty(dto.SecurityLevel) && !validSecurityLevels.Contains(dto.SecurityLevel))
            {
                return BadRequest(new
                {
                    message = "Invalid security level",
                    validValues = validSecurityLevels
                });
            }

            if (!string.IsNullOrEmpty(dto.DocumentType) && !validDocumentTypes.Contains(dto.DocumentType))
            {
                return BadRequest(new
                {
                    message = "Invalid document type",
                    validValues = validDocumentTypes
                });
            }

            if (!string.IsNullOrEmpty(dto.Name))
                document.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.SecurityLevel))
                document.SecurityLevel = dto.SecurityLevel;

            if (!string.IsNullOrEmpty(dto.DocumentType))
                document.DocumentType = dto.DocumentType;

            if (dto.CreateDate.HasValue)
                document.CreateDate = dto.CreateDate.Value;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Document updated successfully",
                document = new
                {
                    document.Id,
                    document.Name,
                    document.SecurityLevel,
                    document.DocumentType,
                    document.CreateDate
                }
            });
        }

       
        [HttpPut("case/{id}")]
        public async Task<IActionResult> UpdateCase(int id, [FromBody] UpdateCaseDto dto)
        {
            var caseEntity = await _context.Cases.FindAsync(id);
            if (caseEntity == null)
                return NotFound(new { message = "Case not found" });

            
            var validStatuses = new List<string>
            {
                "Закрыто", "Активно", "Приостановлено",
                "Передано в другой орган", "Архив", "Рассекречено"
            };

            if (!string.IsNullOrEmpty(dto.Status) && !validStatuses.Contains(dto.Status))
            {
                return BadRequest(new
                {
                    message = "Invalid case status",
                    validValues = validStatuses
                });
            }

            
            if (!string.IsNullOrEmpty(dto.Code))
                caseEntity.Code = dto.Code;

            if (!string.IsNullOrEmpty(dto.Name))
                caseEntity.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.Description))
                caseEntity.Description = dto.Description;

            if (!string.IsNullOrEmpty(dto.Status))
                caseEntity.Status = dto.Status;

            if (dto.OpenDate.HasValue)
                caseEntity.OpenDate = dto.OpenDate.Value;

            if (dto.CloseDate.HasValue)
                caseEntity.CloseDate = dto.CloseDate.Value;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Case updated successfully",
                caseEntity = new
                {
                    caseEntity.Id,
                    caseEntity.Code,
                    caseEntity.Name,
                    caseEntity.Description,
                    caseEntity.Status,
                    caseEntity.OpenDate,
                    caseEntity.CloseDate
                }
            });
        }

      
        [HttpPut("defendant/{id}")]
        public async Task<IActionResult> UpdateDefendant(int id, [FromBody] UpdateDefendantDto dto)
        {
            var defendant = await _context.Defendants.FindAsync(id);
            if (defendant == null)
                return NotFound(new { message = "Defendant not found" });

            
            var validStatuses = new List<string>
    {
        "Подозреваемый", "Обвиняемый", "Объект наблюдения",
        "Свидетель", "Осведомитель", "Потерпевший"
    };

            if (!string.IsNullOrEmpty(dto.Status) && !validStatuses.Contains(dto.Status))
            {
                return BadRequest(new
                {
                    message = "Invalid defendant status",
                    validValues = validStatuses
                });
            }

           
            if (!string.IsNullOrEmpty(dto.Name))
                defendant.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.Surname))
                defendant.Surname = dto.Surname;

            if (!string.IsNullOrEmpty(dto.Alias))
                defendant.Alias = dto.Alias;

            if (!string.IsNullOrEmpty(dto.Status))
                defendant.Status = dto.Status;

            if (dto.BirthDate.HasValue)
                defendant.BirthDate = dto.BirthDate.Value;

            if (dto.DeathDate.HasValue)
                defendant.DeathDate = dto.DeathDate.Value;

            if (!string.IsNullOrEmpty(dto.PhotoUrl))
                defendant.PhotoUrl = dto.PhotoUrl;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Defendant updated successfully",
                defendant = new
                {
                    defendant.Id,
                    defendant.Name,
                    defendant.Surname,
                    defendant.Alias,
                    defendant.Status,
                    defendant.BirthDate,
                    defendant.DeathDate
                }
            });
        }

        [HttpPut("employee/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            
            var validPosts = new List<string>
            {
                "Директор", "Заместитель директора", "Специальный Агент",
                "Аналитик", "Секретарь", "Начальник полевого отдела"
            };

            if (!string.IsNullOrEmpty(dto.Post) && !validPosts.Contains(dto.Post))
            {
                return BadRequest(new
                {
                    message = "Invalid employee position",
                    validValues = validPosts
                });
            }

            
            if (!string.IsNullOrEmpty(dto.Badge))
                employee.Badge = dto.Badge;

            if (!string.IsNullOrEmpty(dto.Name))
                employee.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.Surname))
                employee.Surname = dto.Surname;

            if (!string.IsNullOrEmpty(dto.Post))
                employee.Post = dto.Post;

            if (dto.BirthDate.HasValue)
                employee.BirthDate = dto.BirthDate.Value;

            if (dto.DeathDate.HasValue)
                employee.DeathDate = dto.DeathDate.Value;

            if (!string.IsNullOrEmpty(dto.PhotoUrl))
                employee.PhotoUrl = dto.PhotoUrl;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Employee updated successfully",
                employee = new
                {
                    employee.Id,
                    employee.Badge,
                    employee.Name,
                    employee.Surname,
                    employee.Post,
                    employee.BirthDate,
                    employee.DeathDate
                }
            });
        }


        [HttpPut("series/{id}")]
        public async Task<IActionResult> UpdateSeries(int id, [FromBody] UpdateSeriesDto dto)
        {
            var series = await _context.Series.FindAsync(id);
            if (series == null)
                return NotFound(new { message = "Series not found" });

          
            if (!string.IsNullOrEmpty(dto.Code))
                series.Code = dto.Code;

            if (!string.IsNullOrEmpty(dto.Name))
                series.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.YearPeriod))
                series.YearPeriod = dto.YearPeriod;

            if (!string.IsNullOrEmpty(dto.Description))
                series.Description = dto.Description;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Series updated successfully",
                series = new
                {
                    series.Id,
                    series.Code,
                    series.Name,
                    series.YearPeriod,
                    series.Description
                }
            });
        }


        [HttpPost("document")]
        public async Task<IActionResult> CreateDocument([FromBody] CreateDocumentDto dto)
        {
           
            var validSecurityLevels = new List<string>
    {
        "Совершенно секретно", "Секретно", "Конфиденциально",
        "Для служебного пользования", "Открытый"
    };

           
            var validDocumentTypes = new List<string>
    {
        "Служебная записка", "Отчет о наблюдении", "Протокол допроса",
        "Телеграмма", "Агентурное донесение"
    };

            if (!validSecurityLevels.Contains(dto.SecurityLevel))
                return BadRequest(new
                {
                    message = "Invalid security level",
                    validValues = validSecurityLevels
                });

            if (!validDocumentTypes.Contains(dto.DocumentType))
                return BadRequest(new
                {
                    message = "Invalid document type",
                    validValues = validDocumentTypes
                });

          
            var seriesExists = await _context.Series.AnyAsync(s => s.Id == dto.SeriesId);
            if (!seriesExists)
                return BadRequest(new { message = "Series not found" });

            var caseExists = await _context.Cases.AnyAsync(c => c.Id == dto.CaseId);
            if (!caseExists)
                return BadRequest(new { message = "Case not found" });

            var document = new Document
            {
                Name = dto.Name,
                SecurityLevel = dto.SecurityLevel,
                DocumentType = dto.DocumentType,
                CreateDate = dto.CreateDate,
                SeriesId = dto.SeriesId,
                CaseId = dto.CaseId
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(UpdateDocument), new { id = document.Id }, new
            {
                message = "Document created successfully",
                document = new
                {
                    document.Id,
                    document.Name,
                    document.SecurityLevel,
                    document.DocumentType,
                    document.CreateDate
                }
            });
        }

        [HttpPost("case")]
        public async Task<IActionResult> CreateCase([FromBody] CreateCaseDto dto)
        {
            var validStatuses = new List<string>
    {
        "Закрыто", "Активно", "Приостановлено",
        "Передано в другой орган", "Архив", "Рассекречено"
    };

            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new
                {
                    message = "Invalid case status",
                    validValues = validStatuses
                });

           
            var codeExists = await _context.Cases.AnyAsync(c => c.Code == dto.Code);
            if (codeExists)
                return BadRequest(new { message = "Case code already exists" });

           
            if (dto.DefendantId.HasValue)
            {
                var defendantExists = await _context.Defendants.AnyAsync(d => d.Id == dto.DefendantId.Value);
                if (!defendantExists)
                    return BadRequest(new { message = "Defendant not found" });
            }

          
            if (dto.EmployeeId.HasValue)
            {
                var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId.Value);
                if (!employeeExists)
                    return BadRequest(new { message = "Employee not found" });
            }

            var caseEntity = new Case
            {
                Code = dto.Code,
                Name = dto.Name,
                OpenDate = dto.OpenDate,
                CloseDate = dto.CloseDate,
                Description = dto.Description,
                Status = dto.Status,
                DefendantId = dto.DefendantId,
                EmployeeId = dto.EmployeeId
            };

            _context.Cases.Add(caseEntity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(UpdateCase), new { id = caseEntity.Id }, new
            {
                message = "Case created successfully",
                caseEntity = new
                {
                    caseEntity.Id,
                    caseEntity.Code,
                    caseEntity.Name,
                    caseEntity.Description,
                    caseEntity.Status,
                    caseEntity.OpenDate,
                    caseEntity.CloseDate
                }
            });
        }

        [HttpPost("defendant")]
        public async Task<IActionResult> CreateDefendant([FromBody] CreateDefendantDto dto)
        {
            var validStatuses = new List<string>
    {
        "Подозреваемый", "Обвиняемый", "Объект наблюдения",
        "Свидетель", "Осведомитель", "Потерпевший"
    };

            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new
                {
                    message = "Invalid defendant status",
                    validValues = validStatuses
                });

      
            var organizationExists = await _context.Organizations.AnyAsync(o => o.Id == dto.OrganizationId);
            if (!organizationExists)
                return BadRequest(new { message = "Organization not found" });

            var defendant = new Defendant
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Alias = dto.Alias,
                BirthDate = dto.BirthDate,
                DeathDate = dto.DeathDate,
                Status = dto.Status,
                PhotoUrl = dto.PhotoUrl,
                OrganizationId = dto.OrganizationId
            };

            _context.Defendants.Add(defendant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(UpdateDefendant), new { id = defendant.Id }, new
            {
                message = "Defendant created successfully",
                defendant = new
                {
                    defendant.Id,
                    defendant.Name,
                    defendant.Surname,
                    defendant.Alias,
                    defendant.Status,
                    defendant.BirthDate,
                    defendant.DeathDate
                }
            });
        }

        [HttpPost("employee")]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto)
        {
            var validPosts = new List<string>
    {
        "Директор", "Заместитель директора", "Специальный Агент",
        "Аналитик", "Секретарь", "Начальник полевого отдела"
    };

            if (!validPosts.Contains(dto.Post))
                return BadRequest(new
                {
                    message = "Invalid employee position",
                    validValues = validPosts
                });

          
            var badgeExists = await _context.Employees.AnyAsync(e => e.Badge == dto.Badge);
            if (badgeExists)
                return BadRequest(new { message = "Employee badge already exists" });

           
            var departmentExists = await _context.InvestigationDepartments.AnyAsync(d => d.Id == dto.InvestigationDepartmentId);
            if (!departmentExists)
                return BadRequest(new { message = "Department not found" });

            var employee = new Employee
            {
                Badge = dto.Badge,
                Name = dto.Name,
                Surname = dto.Surname,
                BirthDate = dto.BirthDate,
                DeathDate = dto.DeathDate,
                Post = dto.Post,
                PhotoUrl = dto.PhotoUrl,
                InvestigationDepartmentId = dto.InvestigationDepartmentId
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(UpdateEmployee), new { id = employee.Id }, new
            {
                message = "Employee created successfully",
                employee = new
                {
                    employee.Id,
                    employee.Badge,
                    employee.Name,
                    employee.Surname,
                    employee.Post,
                    employee.BirthDate,
                    employee.DeathDate
                }
            });
        }

        [HttpPost("series")]
        public async Task<IActionResult> CreateSeries([FromBody] CreateSeriesDto dto)
        {
         
            var codeExists = await _context.Series.AnyAsync(s => s.Code == dto.Code);
            if (codeExists)
                return BadRequest(new { message = "Series code already exists" });

            var series = new Series
            {
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                YearPeriod = dto.YearPeriod
            };

            _context.Series.Add(series);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(UpdateSeries), new { id = series.Id }, new
            {
                message = "Series created successfully",
                series = new
                {
                    series.Id,
                    series.Code,
                    series.Name,
                    series.YearPeriod,
                    series.Description
                }
            });
        }

        [HttpPost("organization")]
        public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganizationDto dto)
        {
            var validTypes = new List<string>
    {
        "Преступная организация", "Политическая партия",
        "Коммерческая фирма", "Общественное объединение",
        "Террористическая группа", "Шпионская сеть"
    };

            var validStatuses = new List<string>
    {
        "Активна", "Распущена", "Запрещена", "Под наблюдением"
    };

            if (!string.IsNullOrEmpty(dto.OrganizationType) && !validTypes.Contains(dto.OrganizationType))
                return BadRequest(new
                {
                    message = "Invalid organization type",
                    validValues = validTypes
                });

            if (!string.IsNullOrEmpty(dto.Status) && !validStatuses.Contains(dto.Status))
                return BadRequest(new
                {
                    message = "Invalid organization status",
                    validValues = validStatuses
                });

            var organization = new Organization
            {
                Name = dto.Name,
                Description = dto.Description,
                OrganizationType = dto.OrganizationType,
                EstablishedDate = dto.EstablishedDate,
                DisbandedDate = dto.DisbandedDate,
                Status = dto.Status
            };

            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrganization", "Archive", new { id = organization.Id }, new
            {
                message = "Organization created successfully",
                organization = new
                {
                    organization.Id,
                    organization.Name,
                    organization.OrganizationType,
                    organization.Status
                }
            });
        }

        [HttpPost("department")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto dto)
        {
            var validTypes = new List<string>
    {
        "Полевой отдел", "Аналитический отдел",
        "Следственный отдел", "Отдел наружного наблюдения",
        "Архивный отдел", "Административный отдел"
    };

            var validStatuses = new List<string>
    {
        "Активен", "Расформирован", "Реорганизован"
    };

            if (!string.IsNullOrEmpty(dto.DepartmentType) && !validTypes.Contains(dto.DepartmentType))
                return BadRequest(new
                {
                    message = "Invalid department type",
                    validValues = validTypes
                });

            if (!string.IsNullOrEmpty(dto.Status) && !validStatuses.Contains(dto.Status))
                return BadRequest(new
                {
                    message = "Invalid department status",
                    validValues = validStatuses
                });

           
            var codeExists = await _context.InvestigationDepartments.AnyAsync(d => d.Code == dto.Code);
            if (codeExists)
                return BadRequest(new { message = "Department code already exists" });

            var department = new InvestigationDepartment
            {
                Name = dto.Name,
                Code = dto.Code,
                Description = dto.Description,
                DepartmentType = dto.DepartmentType,
                EstablishedDate = dto.EstablishedDate,
                Status = dto.Status
            };

            _context.InvestigationDepartments.Add(department);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDepartment", "Archive", new { id = department.Id }, new
            {
                message = "Department created successfully",
                department = new
                {
                    department.Id,
                    department.Name,
                    department.Code,
                    department.DepartmentType,
                    department.Status
                }
            });
        }

    }
}