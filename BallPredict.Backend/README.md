dotnet run til að starta





Almennar pælingar sem koma upp við að gera þetta:

- Dotnet er geggjað en syntaxið verður fljótt svolítið ruglað
- Bölvað vesen að setja upp authentication flæðið o.s.frv. Búa til Supabase Clientinn, 
  koma jwt tokeninum alla leið reliably. Framendi sem fær token frá Clerk, gerir request og sendir til bakenda,
  sem þarf að authenticatea hann á móti Supabase, svo er Supabase Clientinn notaður til að gera requestið og þarf
 að nota tokeninn til að authenticata sig á móti rls. En mjög ljúft þegar það er allt klárt, auðvelt að 
 scaffolda nýjan endapunkt vonandi. Sá punktur fer að koma!